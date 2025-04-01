import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser, DecryptField } from 'src/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RsaService } from './rsa.service';

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
  async getPublicKey(): Promise<{ publicKey: string }> {
    const publicKey = await this.rsaService.getPublicKey();
    return { publicKey };
  }

  /**
   * 用户登录
   */
  @Post('login')
  async login(@Body(DecryptField('password')) loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
