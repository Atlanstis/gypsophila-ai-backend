import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LoggerService } from '../logger/logger.service';
import Redis from 'ioredis';

/**
 * Redis服务
 * 提供Redis连接和操作方法
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 模块初始化时连接Redis
   */
  async onModuleInit(): Promise<void> {
    try {
      const redisConfig = this.configService.get('redis');

      this.client = new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password || undefined,
        db: redisConfig.db,
        keyPrefix: redisConfig.keyPrefix,
      });

      this.client.on('connect', () => {
        this.logger.info('Redis连接成功', 'RedisService');
      });

      this.client.on('error', (error) => {
        this.logger.error(`Redis连接错误: ${error.message}`, 'RedisService');
      });

      await this.client.ping();
    } catch (error) {
      this.logger.error(
        `初始化Redis客户端失败: ${error.message}`,
        'RedisService',
        error.stack,
      );
      throw error;
    }
  }

  /**
   * 模块销毁时断开Redis连接
   */
  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.logger.info('Redis连接已关闭', 'RedisService');
    }
  }

  /**
   * 获取Redis客户端实例
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * 设置键值对
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒），可选
   */
  async set(
    key: string,
    value: string | number | Buffer,
    ttl?: number,
  ): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * 获取键值
   * @param key 键
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * 删除键
   * @param key 键
   */
  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * 检查键是否存在
   * @param key 键
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * 设置键的过期时间
   * @param key 键
   * @param ttl 过期时间（秒）
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.client.expire(key, ttl);
    return result === 1;
  }

  /**
   * 获取哈希表中的所有字段和值
   * @param key 哈希表键
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  /**
   * 为哈希表中的字段赋值
   * @param key 哈希表键
   * @param field 字段
   * @param value 值
   */
  async hset(
    key: string,
    field: string,
    value: string | number,
  ): Promise<number> {
    return this.client.hset(key, field, value);
  }

  /**
   * 获取哈希表中指定字段的值
   * @param key 哈希表键
   * @param field 字段
   */
  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }
}
