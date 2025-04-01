import * as argon2 from 'argon2';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  BusinessException,
  CurrentUser,
  DecryptField,
  StatusCode,
} from 'src/common';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
   * 获取RSA公钥
   * 用于客户端对敏感数据进行加密
   */
  @Get('public-key')
  async getPublicKey(): Promise<{ publicKey: string }> {
    const publicKey = await this.authService.getPublicKey();
    return { publicKey };
  }

  /**
   * 用户登录
   */
  @Post('login')
  async login(@Body(DecryptField('password')) loginDto: LoginDto) {
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
        passwordAuth.authData,
        loginDto.password,
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
  @Get('info')
  async getUserInfo(@CurrentUser() user: any): Promise<any> {
    // 返回JWT策略中提取的用户信息
    return user;
  }
}
