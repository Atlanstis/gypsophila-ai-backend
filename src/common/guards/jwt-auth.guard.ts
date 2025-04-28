import { type Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

import { IJwtPayload } from 'src/modules/auth/types';
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
      throw new AuthException('缺少访问令牌', StatusCode.UNAUTHORIZED);
    }

    try {
      // 验证JWT令牌
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token, {
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
      const accessTokenKey = AuthRedisKey.accessToken(payload.sub);
      const refreshTokenKey = AuthRedisKey.refreshToken(payload.sub);
      const storedAccessToken = await this.redisService.get(accessTokenKey);
      const storedRefreshToken = await this.redisService.get(refreshTokenKey);

      // 如果访问令牌不存在，则检查刷新令牌
      if (!storedAccessToken) {
        if (!storedRefreshToken) {
          // 如果刷新令牌也不存在，则抛出错误
          throw new AuthException(
            '访问令牌已失效',
            StatusCode.ACCESS_TOKEN_INVALID,
          );
        } else {
          // 如果刷新令牌存在，则使用刷新令牌重新生成访问令牌
          throw new AuthException(
            '访问令牌已过期',
            StatusCode.ACCESS_TOKEN_EXPIRED,
          );
        }
      }
      // 如果访问令牌存在，则检查是否与请求中的令牌一致
      if (storedAccessToken !== token) {
        // 如果令牌不一致，则抛出错误
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
