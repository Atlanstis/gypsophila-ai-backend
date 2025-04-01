import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthException, BusinessException, StatusCode } from 'src/common';

import { ConfigService } from '../../config/config.service';
import { AuthType, UserAuth } from '../users/entities/user-auth.entity';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

/**
 * Token对类型定义
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT载荷接口
 */
export interface JwtPayload {
  sub: string;
  username: string;
  type: 'access' | 'refresh';
}

/**
 * 认证服务
 * 处理用户认证相关的业务逻辑
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
  ) {}

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto): Promise<TokenPair> {
    // 通过用户名查找用户
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    const error = new BusinessException(
      '用户名或密码错误',
      StatusCode.PASSWORD_ERROR,
    );

    if (!user) {
      throw error;
    }

    // 查找用户的密码认证
    const passwordAuth = await this.userAuthRepository.findOne({
      where: { userId: user.id, authType: AuthType.PASSWORD },
    });

    if (!passwordAuth) {
      throw error;
    }

    // 验证密码
    const isPasswordValid = await argon2.verify(
      passwordAuth.authData,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw error;
    }

    // 登录成功，生成令牌对
    return this.generateTokens(user.id, user.username);
  }

  /**
   * 生成令牌对
   */
  generateTokens(userId: string, username: string): TokenPair {
    const accessPayload: JwtPayload = {
      sub: userId,
      username,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: userId,
      username,
      type: 'refresh',
    };

    return {
      accessToken: this.jwtService.sign(accessPayload, {
        expiresIn: this.configService.get('jwt', 'expiresIn'),
      }),
      refreshToken: this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.get('jwt', 'refreshExpiresIn'),
      }),
    };
  }

  /**
   * 刷新令牌
   */
  refreshTokens(refreshToken: string): TokenPair {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt', 'secret'),
      }) as JwtPayload;

      // 确保是刷新令牌
      if (payload.type !== 'refresh') {
        throw new AuthException(
          '无效的刷新令牌',
          StatusCode.REFRESH_TOKEN_INVALID,
        );
      }

      return this.generateTokens(payload.sub, payload.username);
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw new AuthException(
          '刷新令牌已过期',
          StatusCode.REFRESH_TOKEN_EXPIRED,
        );
      }

      throw new AuthException(
        '无效的刷新令牌',
        StatusCode.REFRESH_TOKEN_INVALID,
      );
    }
  }

  /**
   * 验证访问令牌
   */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('jwt', 'secret'),
      }) as JwtPayload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthException('令牌已过期', StatusCode.TOKEN_EXPIRED);
      }

      throw new AuthException('无效的令牌', StatusCode.TOKEN_INVALID);
    }
  }
}
