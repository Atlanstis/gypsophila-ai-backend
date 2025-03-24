import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusCode } from '../enums/status-code.enum';
import { AuthException } from '../exceptions/auth.exception';

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
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 生成令牌对
   */
  generateTokens(userId: string, username: string) {
    const payload = { sub: userId, username };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }),
    };
  }

  /**
   * 刷新令牌
   */
  refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return this.generateTokens(payload.sub, payload.username);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthException(
          '刷新令牌已过期',
          StatusCode.REFRESH_TOKEN_EXPIRED,
        );
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AuthException(
          '无效的刷新令牌',
          StatusCode.REFRESH_TOKEN_INVALID,
        );
      }
      throw new AuthException('令牌已过期', StatusCode.TOKEN_EXPIRED);
    }
  }

  /**
   * 验证访问令牌
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthException('令牌已过期', StatusCode.TOKEN_EXPIRED);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AuthException('无效的令牌', StatusCode.TOKEN_INVALID);
      }
      throw error;
    }
  }
}
