import { Injectable } from '@nestjs/common';

import { RedisKeyPattern } from './redis-key.constant';
import { RedisService } from './redis.service';

/**
 * Redis 键信息接口
 */
export interface RedisKeyInfo {
  key: string;
  type: string;
  ttl: number;
  size?: number;
}

/**
 * Redis 键统计信息
 */
export interface RedisKeyStats {
  totalKeys: number;
  keysByPrefix: Record<string, number>;
  expiredKeysCount: number;
}

/**
 * Redis 辅助服务
 * 提供Redis高级操作，包括key管理和监控
 */
@Injectable()
export class RedisHelperService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * 获取所有键的信息
   * @param pattern 键匹配模式，默认为所有键
   * @returns Redis键信息数组
   */
  async getAllKeys(pattern = '*'): Promise<RedisKeyInfo[]> {
    const client = this.redisService.getClient();
    const keys = await client.keys(pattern);

    const keyInfoPromises = keys.map(async (key) => {
      const type = await client.type(key);
      const ttl = await client.ttl(key);

      let size = 0;
      if (type === 'string') {
        const value = await client.get(key);
        size = value ? Buffer.from(value).length : 0;
      } else if (type === 'hash') {
        const hashValues = await client.hgetall(key);
        size = JSON.stringify(hashValues).length;
      } else if (type === 'list') {
        size = await client.llen(key);
      } else if (type === 'set') {
        size = await client.scard(key);
      } else if (type === 'zset') {
        size = await client.zcard(key);
      }

      return { key, type, ttl, size };
    });

    return Promise.all(keyInfoPromises);
  }

  /**
   * 获取键统计信息
   * @returns Redis键统计信息
   */
  async getKeyStats(): Promise<RedisKeyStats> {
    const keys = await this.getAllKeys();
    const totalKeys = keys.length;

    // 按前缀统计键数量
    const keysByPrefix: Record<string, number> = {};
    keys.forEach((keyInfo) => {
      const prefix = keyInfo.key.split(':')[0];
      keysByPrefix[prefix] = (keysByPrefix[prefix] || 0) + 1;
    });

    // 统计过期键数量
    const expiredKeysCount = keys.filter((keyInfo) => keyInfo.ttl > 0).length;

    return {
      totalKeys,
      keysByPrefix,
      expiredKeysCount,
    };
  }

  /**
   * 清理特定前缀的所有键
   * @param pattern 键匹配模式
   * @returns 删除的键数量
   */
  async cleanupKeysByPattern(pattern: string): Promise<number> {
    const client = this.redisService.getClient();
    const keys = await client.keys(pattern);

    if (keys.length === 0) {
      return 0;
    }

    const result = await client.del(...keys);
    return result;
  }

  /**
   * 清理认证模块的所有键
   * @returns 删除的键数量
   */
  async cleanupAuthKeys(): Promise<number> {
    return this.cleanupKeysByPattern(RedisKeyPattern.ALL_AUTH_KEYS);
  }

  /**
   * 清理用户模块的所有键
   * @returns 删除的键数量
   */
  async cleanupUserKeys(): Promise<number> {
    return this.cleanupKeysByPattern(RedisKeyPattern.ALL_USER_KEYS);
  }

  /**
   * 清理缓存模块的所有键
   * @returns 删除的键数量
   */
  async cleanupCacheKeys(): Promise<number> {
    return this.cleanupKeysByPattern(RedisKeyPattern.ALL_CACHE_KEYS);
  }

  /**
   * 清理系统模块的所有键
   * @returns 删除的键数量
   */
  async cleanupSystemKeys(): Promise<number> {
    return this.cleanupKeysByPattern(RedisKeyPattern.ALL_SYSTEM_KEYS);
  }

  /**
   * 清理特定用户的所有键
   * @param userId 用户ID
   * @returns 删除的键数量
   */
  async cleanupUserRelatedKeys(userId: string): Promise<number> {
    return this.cleanupKeysByPattern(
      RedisKeyPattern.allUserRelatedKeys(userId),
    );
  }

  /**
   * 刷新键的过期时间
   * @param key 键名
   * @param ttl 新的过期时间（秒）
   * @returns 操作是否成功
   */
  async refreshKeyTTL(key: string, ttl: number): Promise<boolean> {
    return this.redisService.expire(key, ttl);
  }

  /**
   * 重命名键
   * @param oldKey 旧键名
   * @param newKey 新键名
   * @returns 操作是否成功
   */
  async renameKey(oldKey: string, newKey: string): Promise<boolean> {
    const client = this.redisService.getClient();
    const exists = await client.exists(oldKey);

    if (!exists) {
      return false;
    }

    await client.rename(oldKey, newKey);
    return true;
  }

  /**
   * 搜索键（支持模糊搜索）
   * @param searchPattern 搜索模式
   * @returns 匹配的键信息
   */
  async searchKeys(searchPattern: string): Promise<RedisKeyInfo[]> {
    return this.getAllKeys(`*${searchPattern}*`);
  }
}
