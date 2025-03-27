import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { AuthService, JwtPayload } from './auth.service';
import { UsersService } from '../../modules/users/users.service';

/**
 * JWT认证策略
 * 用于验证JWT令牌并提取用户信息
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt', 'secret'),
    });
  }

  /**
   * 验证JWT负载并返回用户信息
   */
  async validate(payload: JwtPayload) {
    try {
      // 确保是访问令牌
      if (payload.type !== 'access') {
        throw new UnauthorizedException('无效的访问令牌');
      }

      // 获取用户
      const user = await this.usersService.findOne(payload.sub);

      // 提取角色信息
      const roles = user.userRoles.map((userRole) => userRole.role.name);

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        isBuiltin: user.isBuiltin,
        roles,
      };
    } catch (error) {
      throw new UnauthorizedException('认证失败');
    }
  }
}
