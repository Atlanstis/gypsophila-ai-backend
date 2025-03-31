import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from '../../common/exceptions/business.exception';
import { StatusCode } from '../../common/enums/status-code.enum';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { EncryptedDataDto } from './dto/encrypted-data.dto';
import { DecryptData } from './decorators/decrypt-data.decorator';

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
  getPublicKey(): { publicKey: string } {
    const publicKey = this.authService.getPublicKey();
    return { publicKey };
  }

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
   * 使用加密数据登录
   * 接收加密的用户名和密码
   */
  @Post('secure-login')
  async secureLogin(
    @Body() encryptedDataDto: EncryptedDataDto,
    @DecryptData() decryptedData: any,
  ) {
    try {
      // 从解密数据中提取用户名和密码
      const { username, password } = decryptedData;

      // 构造普通登录DTO
      const loginDto = new LoginDto();
      loginDto.username = username;
      loginDto.password = password;

      // 调用普通登录逻辑
      return await this.login(loginDto);
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException(
        '登录失败，请确保数据已正确加密',
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

  /**
   * 解密数据（仅用于测试）
   */
  @Post('decrypt')
  decryptData(@Body() encryptedDataDto: EncryptedDataDto): {
    decryptedData: string;
  } {
    const decryptedData = this.authService.decryptData(
      encryptedDataDto.encryptedData,
    );
    return { decryptedData };
  }

  /**
   * 测试加密解密功能
   * 用于验证加密和解密正常工作
   */
  @Post('test-encryption')
  testEncryption(@Body() encryptedDataDto: EncryptedDataDto): {
    success: boolean;
    original: string;
    decrypted: any;
  } {
    try {
      // 解密数据
      const decryptedString = this.authService.decryptData(
        encryptedDataDto.encryptedData,
      );
      const decryptedData = JSON.parse(decryptedString);

      return {
        success: true,
        original: encryptedDataDto.encryptedData,
        decrypted: decryptedData,
      };
    } catch (error) {
      return {
        success: false,
        original: encryptedDataDto.encryptedData,
        decrypted: error.message || '解密失败',
      };
    }
  }
}
