import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from '../exceptions/business.exception';
import { StatusCode } from '../enums/status-code.enum';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

/**
 * 认证控制器
 * 处理用户认证相关的请求
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      // 在实际项目中，这里应该验证用户名和密码
      // 本示例简化为固定的演示账号
      if (loginDto.username === 'admin' && loginDto.password === 'password') {
        // 登录成功，生成令牌对
        return this.authService.generateTokens('1', loginDto.username);
      }

      // 登录失败（使用业务异常，因为密码错误不是授权问题而是验证问题）
      throw new BusinessException(
        '用户名或密码错误',
        StatusCode.PASSWORD_ERROR,
      );
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
