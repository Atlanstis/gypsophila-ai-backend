import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthException, StatusCode } from 'src/common';

import { ConfigService } from '../../config/config.service';
import { RsaService } from './rsa.service';

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
    private readonly rsaService: RsaService,
  ) {}

  /**
   * 获取公钥
   */
  async getPublicKey(): Promise<string> {
    return this.rsaService.getPublicKey();
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
