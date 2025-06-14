import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import {
  CurrentUser,
  DecryptField,
  ICurrentUser,
  JwtAuthGuard,
  ResponseMessage,
} from 'src/common';
import { RsaService } from 'src/rsa';

import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto';
import {
  GetAuthInfoResponse,
  GetPublicKeyResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from './types';

/**
 * 认证控制器
 * 处理用户认证相关的请求
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rsaService: RsaService,
  ) {}

  /**
   * 获取RSA公钥
   * 用于客户端对敏感数据进行加密
   */
  @Get('public-key')
  async getPublicKey(): Promise<GetPublicKeyResponse> {
    const publicKey = await this.rsaService.getPublicKey();
    return { publicKey };
  }

  /**
   * 用户登录
   */
  @Post('login')
  @ResponseMessage('登录成功')
  async login(
    @Body(DecryptField('password')) loginDto: LoginDto,
  ): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  /**
   * 刷新访问令牌
   */
  @Post('refresh')
  @ResponseMessage('令牌刷新成功')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  /**
   * 获取当前用户信息（需要认证）
   */
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(
    @CurrentUser() user: ICurrentUser,
  ): Promise<GetAuthInfoResponse> {
    // 返回JWT验证中提取的用户信息
    return user;
  }

  /**
   * 用户登出
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ResponseMessage('登出成功')
  async logout(@CurrentUser('id') userId: string): Promise<LogoutResponse> {
    return await this.authService.logout(userId);
  }
}
