import { type Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

import { JwtPayload } from 'src/modules/auth/auth.service';
import { AuthRedisKey } from 'src/redis/redis-key.constant';

import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { StatusCode } from '../enums/status-code.enum';
import { AuthException } from '../exceptions/auth.exception';

/**
 * JWT认证守卫
 * 用于验证请求中的JWT令牌
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 验证请求是否可以通过
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AuthException(
        '缺少访问令牌，请提供有效的 JWT Token',
        StatusCode.UNAUTHORIZED,
      );
    }

    try {
      // 验证JWT令牌
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt', 'secret'),
      });

      // 确保是访问令牌
      if (payload.type !== 'access') {
        throw new AuthException(
          '访问令牌类型错误',
          StatusCode.ACCESS_TOKEN_INVALID,
        );
      }

      // 验证Redis中是否存在此令牌
      const redisKey = AuthRedisKey.accessToken(payload.sub);
      const storedToken = await this.redisService.get(redisKey);

      if (!storedToken) {
        throw new AuthException(
          '访问令牌已失效',
          StatusCode.ACCESS_TOKEN_INVALID,
        );
      }
      if (storedToken !== token) {
        throw new AuthException(
          '已在其他地方登录，访问令牌已失效',
          StatusCode.ACCESS_TOKEN_INVALID,
        );
      }

      // 将用户信息添加到请求对象中
      request.user = {
        id: payload.sub,
        username: payload.username,
      };

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AuthException(
          '访问令牌已过期',
          StatusCode.ACCESS_TOKEN_EXPIRED,
        );
      }
      if (error instanceof JsonWebTokenError) {
        throw new AuthException(
          '无效的访问令牌',
          StatusCode.ACCESS_TOKEN_INVALID,
        );
      }
      if (error instanceof AuthException) {
        throw error;
      }
      throw new AuthException(
        error.message || '认证失败',
        StatusCode.UNAUTHORIZED,
      );
    }
  }

  /**
   * 从请求头中提取JWT令牌
   */
  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
