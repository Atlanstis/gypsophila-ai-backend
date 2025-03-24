import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StatusCode } from '../enums/status-code.enum';
import { AuthException } from '../exceptions/auth.exception';

/**
 * JWT认证守卫
 * 用于验证请求中的JWT令牌
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AuthException('访问令牌已过期', StatusCode.TOKEN_EXPIRED);
      }
      if (err.name === 'JsonWebTokenError') {
        throw new AuthException('无效的访问令牌', StatusCode.TOKEN_INVALID);
      }
      throw new AuthException('认证失败', StatusCode.UNAUTHORIZED);
    }
    return user;
  }
}
