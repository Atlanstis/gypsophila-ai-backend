import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusCode } from '../../common/enums/status-code.enum';
import { AuthException } from '../../common/exceptions/auth.exception';
import { ConfigService } from '../../config/config.service';
import {
  generateKeyPairSync,
  privateDecrypt,
  publicEncrypt,
  constants,
} from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Token对类型定义
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT载荷接口
 */
export interface JwtPayload {
  sub: string;
  username: string;
  type: 'access' | 'refresh';
}

/**
 * 认证服务
 * 处理用户认证相关的业务逻辑
 */
@Injectable()
export class AuthService {
  private readonly keyPairPath = path.join(process.cwd(), 'keys');
  private readonly publicKeyPath = path.join(this.keyPairPath, 'public.key');
  private readonly privateKeyPath = path.join(this.keyPairPath, 'private.key');

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.ensureKeyPairExists();
  }

  /**
   * 确保密钥对存在，如不存在则生成
   */
  private ensureKeyPairExists(): void {
    if (!fs.existsSync(this.keyPairPath)) {
      fs.mkdirSync(this.keyPairPath, { recursive: true });
    }

    if (
      !fs.existsSync(this.publicKeyPath) ||
      !fs.existsSync(this.privateKeyPath)
    ) {
      this.generateKeyPair();
    }
  }

  /**
   * 生成RSA密钥对
   */
  private generateKeyPair(): void {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    fs.writeFileSync(this.publicKeyPath, publicKey);
    fs.writeFileSync(this.privateKeyPath, privateKey);
  }

  /**
   * 获取公钥
   */
  getPublicKey(): string {
    return fs.readFileSync(this.publicKeyPath, 'utf8');
  }

  /**
   * 获取私钥
   */
  private getPrivateKey(): string {
    return fs.readFileSync(this.privateKeyPath, 'utf8');
  }

  /**
   * 使用私钥解密数据
   * @param encryptedData 加密后的数据（Base64编码）
   */
  decryptData(encryptedData: string): string {
    try {
      const privateKey = this.getPrivateKey();
      const buffer = Buffer.from(encryptedData, 'base64');

      const decrypted = privateDecrypt(
        {
          key: privateKey,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        buffer,
      );

      return decrypted.toString('utf8');
    } catch (error) {
      console.error('解密失败:', error.message);
      throw new Error(`解密失败: ${error.message}`);
    }
  }

  /**
   * 测试加密方法
   * @param data 需要加密的数据
   * @returns 加密后的数据（Base64编码）
   */
  testEncrypt(data: string): string {
    const publicKey = this.getPublicKey();
    const buffer = Buffer.from(data);

    const encrypted = publicEncrypt(
      {
        key: publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer,
    );

    return encrypted.toString('base64');
  }

  /**
   * 生成令牌对
   */
  generateTokens(userId: string, username: string): TokenPair {
    const accessPayload: JwtPayload = {
      sub: userId,
      username,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: userId,
      username,
      type: 'refresh',
    };

    return {
      accessToken: this.jwtService.sign(accessPayload, {
        expiresIn: this.configService.get('jwt', 'expiresIn'),
      }),
      refreshToken: this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.get('jwt', 'refreshExpiresIn'),
      }),
    };
  }

  /**
   * 刷新令牌
   */
  refreshTokens(refreshToken: string): TokenPair {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt', 'secret'),
      }) as JwtPayload;

      // 确保是刷新令牌
      if (payload.type !== 'refresh') {
        throw new AuthException(
          '无效的刷新令牌',
          StatusCode.REFRESH_TOKEN_INVALID,
        );
      }

      return this.generateTokens(payload.sub, payload.username);
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw new AuthException(
          '刷新令牌已过期',
          StatusCode.REFRESH_TOKEN_EXPIRED,
        );
      }

      throw new AuthException(
        '无效的刷新令牌',
        StatusCode.REFRESH_TOKEN_INVALID,
      );
    }
  }

  /**
   * 验证访问令牌
   */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('jwt', 'secret'),
      }) as JwtPayload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthException('令牌已过期', StatusCode.TOKEN_EXPIRED);
      }

      throw new AuthException('无效的令牌', StatusCode.TOKEN_INVALID);
    }
  }
}
