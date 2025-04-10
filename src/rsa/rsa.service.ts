import {
  constants,
  generateKeyPairSync,
  privateDecrypt,
  publicEncrypt,
} from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import { Injectable, OnModuleInit } from '@nestjs/common';

import { BusinessException } from 'src/common';
import { ConfigService } from 'src/config/config.service';
import { AuthRedisKey } from 'src/redis/redis-key.constant';
import { RedisService } from 'src/redis/redis.service';

/**
 * RSA 加密服务
 * 处理 RSA 密钥对生成、存储和加解密操作
 */
@Injectable()
export class RsaService implements OnModuleInit {
  private readonly keyPairPath = path.join(process.cwd(), 'keys');
  private readonly publicKeyPath = path.join(this.keyPairPath, 'public.key');
  private readonly privateKeyPath = path.join(this.keyPairPath, 'private.key');
  private readonly isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.isProduction = this.configService.get('app', 'env') === 'production';
  }

  /**
   * 模块初始化时确保密钥对存在
   */
  async onModuleInit(): Promise<void> {
    // 初始化密钥对
    await this.ensureKeyPairExists();
  }

  /**
   * 确保 RSA 密钥对存在
   * 如果不存在就生成新的密钥对
   */
  private async ensureKeyPairExists(): Promise<void> {
    try {
      // 检查目录是否存在
      if (!fs.existsSync(this.keyPairPath)) {
        await fs.promises.mkdir(this.keyPairPath, { recursive: true });
      }

      // 检查 Redis 中是否有密钥对
      const publicKeyInRedis = await this.redisService.get(
        AuthRedisKey.PUBLIC_KEY,
      );
      const privateKeyInRedis = await this.redisService.get(
        AuthRedisKey.PRIVATE_KEY,
      );

      if (publicKeyInRedis && privateKeyInRedis) {
        // Redis 中有密钥对，检查文件是否也存在
        if (
          !fs.existsSync(this.publicKeyPath) ||
          !fs.existsSync(this.privateKeyPath)
        ) {
          // 文件不存在，从 Redis 恢复到文件
          await this.saveKeysToFile(publicKeyInRedis, privateKeyInRedis);
        }
        return;
      }

      // 检查文件是否存在
      if (
        fs.existsSync(this.publicKeyPath) &&
        fs.existsSync(this.privateKeyPath)
      ) {
        // 文件存在，加载到 Redis
        const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
        const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
        await this.saveKeysToRedis(publicKey, privateKey);
        return;
      }

      // 都不存在，生成新的密钥对
      const { publicKey, privateKey } = this.generateKeyPair();
      await this.saveKeysToFile(publicKey, privateKey);
      await this.saveKeysToRedis(publicKey, privateKey);
    } catch (error) {
      console.error('初始化 RSA 密钥对时出错:', error);
      throw new BusinessException('RSA 密钥初始化失败');
    }
  }

  /**
   * 将密钥对保存到Redis
   * @param publicKey 公钥(可选)
   * @param privateKey 私钥(可选)
   */
  private async saveKeysToRedis(
    publicKey?: string,
    privateKey?: string,
  ): Promise<void> {
    if (publicKey) {
      await this.redisService.set(AuthRedisKey.PUBLIC_KEY, publicKey);
    }
    if (privateKey) {
      await this.redisService.set(AuthRedisKey.PRIVATE_KEY, privateKey);
    }
  }

  /**
   * 将密钥对保存到文件
   * @param publicKey 公钥
   * @param privateKey 私钥
   */
  private async saveKeysToFile(
    publicKey: string,
    privateKey: string,
  ): Promise<void> {
    await fs.promises.writeFile(this.publicKeyPath, publicKey);
    await fs.promises.writeFile(this.privateKeyPath, privateKey);
  }

  /**
   * 生成RSA密钥对
   * @returns 公钥和私钥
   */
  private generateKeyPair(): { publicKey: string; privateKey: string } {
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

    return { publicKey, privateKey };
  }

  /**
   * 获取公钥
   */
  async getPublicKey(): Promise<string> {
    // 优先从 Redis 获取
    const publicKeyInRedis = await this.redisService.get(
      AuthRedisKey.PUBLIC_KEY,
    );
    if (publicKeyInRedis) {
      return publicKeyInRedis;
    }

    // Redis中不存在则从文件获取
    const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
    await this.saveKeysToRedis(publicKey);
    return publicKey;
  }

  /**
   * 获取私钥
   */
  private async getPrivateKey(): Promise<string> {
    // 优先从 Redis 获取
    const privateKeyInRedis = await this.redisService.get(
      AuthRedisKey.PRIVATE_KEY,
    );
    if (privateKeyInRedis) {
      return privateKeyInRedis;
    }

    // Redis中不存在则从文件获取
    const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
    await this.saveKeysToRedis(undefined, privateKey);
    return privateKey;
  }

  /**
   * 使用私钥解密数据
   * @param encryptedData 加密后的数据（Base64编码）
   * @param fieldName 需要解密的字段名
   */
  async decryptData(encryptedData: string, fieldName: string): Promise<string> {
    try {
      const privateKey = await this.getPrivateKey();
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
    } catch {
      throw new BusinessException(`加密字段 ${fieldName} 解密失败`);
    }
  }

  /**
   * 使用公钥加密数据
   * @param data 需要加密的数据
   * @returns 加密后的数据（Base64编码）
   */
  async encryptData(data: string): Promise<string> {
    const publicKey = await this.getPublicKey();
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
}
