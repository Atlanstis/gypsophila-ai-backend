import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StatusCode } from '../../enums/status-code.enum';
import { AuthException } from '../../exceptions/auth.exception';
import { JwtPayload } from '../auth.service';

/**
 * JWT策略
 * 用于验证JWT令牌
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  /**
   * 验证JWT载荷
   * @param payload JWT载荷
   */
  async validate(payload: JwtPayload) {
    // 确保是访问令牌
    if (payload.type !== 'access') {
      throw new AuthException('无效的访问令牌', StatusCode.TOKEN_INVALID);
    }

    // 返回用户信息，会被附加到请求对象上
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
