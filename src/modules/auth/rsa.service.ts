import * as fs from 'fs';
import * as path from 'path';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import {
  generateKeyPairSync,
  privateDecrypt,
  publicEncrypt,
  constants,
} from 'crypto';
import { REDIS_PUBLIC_KEY, REDIS_PRIVATE_KEY } from './rsa-redis-key';
import { BusinessException } from 'src/common/exceptions/business.exception';

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
   * 确保密钥对存在，如不存在则生成
   */
  private async ensureKeyPairExists(): Promise<void> {
    // 生产环境每次启动时都重新生成密钥对
    if (this.isProduction) {
      const { publicKey, privateKey } = this.generateKeyPair();
      await this.saveKeysToRedis(publicKey, privateKey);
      await this.saveKeysToFile(publicKey, privateKey);
      return;
    }

    // 检查 Redis 中是否存在密钥对
    const publicKeyInRedis = await this.redisService.get(REDIS_PUBLIC_KEY);
    const privateKeyInRedis = await this.redisService.get(REDIS_PRIVATE_KEY);

    // 非生产环境，先尝试从 Redis 获取
    if (publicKeyInRedis && privateKeyInRedis) {
      return;
    }

    // Redis 中不存在，检查文件
    if (!fs.existsSync(this.keyPairPath)) {
      fs.mkdirSync(this.keyPairPath, { recursive: true });
    }

    if (
      fs.existsSync(this.publicKeyPath) &&
      fs.existsSync(this.privateKeyPath)
    ) {
      // 文件存在，读取并存入 Redis
      const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
      const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
      await this.saveKeysToRedis(publicKey, privateKey);
    } else {
      // 文件不存在，生成新的密钥对
      const { publicKey, privateKey } = this.generateKeyPair();
      await this.saveKeysToRedis(publicKey, privateKey);
      await this.saveKeysToFile(publicKey, privateKey);
    }
  }

  /**
   * 将密钥对保存到Redis
   */
  private async saveKeysToRedis(
    publicKey: string,
    privateKey: string,
  ): Promise<void> {
    await this.redisService.set(REDIS_PUBLIC_KEY, publicKey);
    await this.redisService.set(REDIS_PRIVATE_KEY, privateKey);
  }

  /**
   * 将密钥对保存到文件
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
    const publicKeyInRedis = await this.redisService.get(REDIS_PUBLIC_KEY);
    if (publicKeyInRedis) {
      return publicKeyInRedis;
    }

    // Redis中不存在则从文件获取
    return fs.readFileSync(this.publicKeyPath, 'utf8');
  }

  /**
   * 获取私钥
   */
  private async getPrivateKey(): Promise<string> {
    // 优先从 Redis 获取
    const privateKeyInRedis = await this.redisService.get(REDIS_PRIVATE_KEY);
    if (privateKeyInRedis) {
      return privateKeyInRedis;
    }

    // Redis中不存在则从文件获取
    return fs.readFileSync(this.privateKeyPath, 'utf8');
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
      throw new BusinessException(`解密失败: ${fieldName}`);
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
