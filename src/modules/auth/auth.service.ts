import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthException, BusinessException, StatusCode } from 'src/common';
import { ConfigService } from 'src/config/config.service';
import { AuthRedisKey } from 'src/redis/redis-key.constant';
import { RedisService } from 'src/redis/redis.service';

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
    private readonly redisService: RedisService,
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
  async generateTokens(userId: string, username: string): Promise<TokenPair> {
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

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: this.configService.get('jwt', 'expiresIn'),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: this.configService.get('jwt', 'refreshExpiresIn'),
    });

    // 将令牌存储在Redis中
    const accessTokenTtl = this.getExpiresInSeconds(
      this.configService.get('jwt', 'expiresIn'),
    );
    const refreshTokenTtl = this.getExpiresInSeconds(
      this.configService.get('jwt', 'refreshExpiresIn'),
    );

    await this.redisService.set(
      AuthRedisKey.accessToken(userId),
      accessToken,
      accessTokenTtl,
    );
    await this.redisService.set(
      AuthRedisKey.refreshToken(userId),
      refreshToken,
      refreshTokenTtl,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 刷新令牌
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      // 验证刷新令牌
      const payload = this.jwtService.verify(refreshToken, {}) as JwtPayload;

      // 确保是刷新令牌
      if (payload.type !== 'refresh') {
        throw new AuthException(
          '无效的刷新令牌',
          StatusCode.REFRESH_TOKEN_INVALID,
        );
      }

      // 验证Redis中是否存在此刷新令牌
      const redisKey = AuthRedisKey.refreshToken(payload.sub);
      const storedToken = await this.redisService.get(redisKey);

      if (!storedToken || storedToken !== refreshToken) {
        throw new AuthException(
          '无效的刷新令牌',
          StatusCode.REFRESH_TOKEN_INVALID,
        );
      }

      // 删除旧令牌
      await this.redisService.delete(AuthRedisKey.accessToken(payload.sub));
      await this.redisService.delete(AuthRedisKey.refreshToken(payload.sub));

      // 生成新的令牌对
      return this.generateTokens(payload.sub, payload.username);
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      if (error instanceof TokenExpiredError) {
        throw new AuthException(
          '刷新令牌已过期',
          StatusCode.REFRESH_TOKEN_EXPIRED,
        );
      }
      if (error instanceof JsonWebTokenError) {
        throw new AuthException(
          '无效的访问令牌',
          StatusCode.ACCESS_TOKEN_INVALID,
        );
      }

      throw new AuthException(
        error.message || '认证失败',
        StatusCode.UNAUTHORIZED,
      );
    }
  }

  /**
   * 用户登出
   */
  async logout(userId: string): Promise<void> {
    // 删除Redis中的令牌
    await this.redisService.delete(AuthRedisKey.accessToken(userId));
    await this.redisService.delete(AuthRedisKey.refreshToken(userId));
  }

  /**
   * 将过期时间字符串转换为秒数
   */
  private getExpiresInSeconds(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 3600; // 默认1小时
    }
  }
}
