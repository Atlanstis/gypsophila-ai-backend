import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from '../exceptions/business.exception';
import { StatusCode } from '../enums/status-code.enum';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../../modules/users/users.service';
import * as argon2 from 'argon2';

/**
 * 认证控制器
 * 处理用户认证相关的请求
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 用户登录
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      // 通过用户名查找用户
      const users = await this.usersService.findAll({
        username: loginDto.username,
      });

      if (users.total === 0) {
        throw new BusinessException(
          '用户名或密码错误',
          StatusCode.PASSWORD_ERROR,
        );
      }

      const user = users.items[0];

      // 查找用户的密码认证
      const userWithAuth = await this.usersService.findOne(user.id);
      const passwordAuth = userWithAuth.auths.find(
        (auth) => auth.authType === 'password',
      );

      if (!passwordAuth) {
        throw new BusinessException(
          '用户未设置密码',
          StatusCode.PASSWORD_ERROR,
        );
      }

      // 验证密码
      const isPasswordValid = await argon2.verify(
        loginDto.password,
        passwordAuth.authData,
      );

      if (!isPasswordValid) {
        throw new BusinessException(
          '用户名或密码错误',
          StatusCode.PASSWORD_ERROR,
        );
      }

      // 登录成功，生成令牌对
      return this.authService.generateTokens(user.id, user.username);
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException(
        '用户名或密码错误',
        StatusCode.PASSWORD_ERROR,
      );
    }
  }

  /**
   * 刷新访问令牌
   */
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  /**
   * 获取当前用户信息（需要认证）
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('me')
  async getProfile(): Promise<any> {
    // 在实际项目中，这里应该从数据库查询完整的用户信息
    return {
      id: '1',
      username: 'admin',
      name: '管理员',
      roles: ['admin'],
    };
  }
}
