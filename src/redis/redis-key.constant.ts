/**
 * Redis key 常量定义和管理工具
 * 提供统一的 Redis key 前缀管理，避免重复和冲突
 */

/**
 * 业务模块前缀枚举
 */
export enum RedisKeyPrefix {
  AUTH = 'auth',
  USER = 'user',
  SYSTEM = 'system',
  CACHE = 'cache',
}

/**
 * Auth 模块相关的 Redis key
 */
export class AuthRedisKey {
  /**
   * 公钥存储的键名
   */
  static readonly PUBLIC_KEY = `${RedisKeyPrefix.AUTH}:public_key`;

  /**
   * 私钥存储的键名
   */
  static readonly PRIVATE_KEY = `${RedisKeyPrefix.AUTH}:private_key`;

  /**
   * 用户访问令牌
   * @param userId 用户ID
   */
  static accessToken(userId: string): string {
    return `${RedisKeyPrefix.AUTH}:token:${userId}:access`;
  }

  /**
   * 用户刷新令牌
   * @param userId 用户ID
   */
  static refreshToken(userId: string): string {
    return `${RedisKeyPrefix.AUTH}:token:${userId}:refresh`;
  }
}

/**
 * 用户模块相关的 Redis key
 */
export class UserRedisKey {
  /**
   * 用户信息缓存
   * @param userId 用户ID
   */
  static userInfo(userId: string): string {
    return `${RedisKeyPrefix.USER}:info:${userId}`;
  }

  /**
   * 用户权限缓存
   * @param userId 用户ID
   */
  static userPermissions(userId: string): string {
    return `${RedisKeyPrefix.USER}:permissions:${userId}`;
  }
}

/**
 * 系统模块相关的 Redis key
 */
export class SystemRedisKey {
  /**
   * 系统配置缓存
   * @param configKey 配置项key
   */
  static config(configKey: string): string {
    return `${RedisKeyPrefix.SYSTEM}:config:${configKey}`;
  }
}

/**
 * 通用缓存相关的 Redis key
 */
export class CacheRedisKey {
  /**
   * 业务数据缓存
   * @param module 模块名
   * @param entityName 实体名称
   * @param entityId 实体ID
   */
  static entityCache(
    module: string,
    entityName: string,
    entityId: string,
  ): string {
    return `${RedisKeyPrefix.CACHE}:${module}:${entityName}:${entityId}`;
  }

  /**
   * 列表数据缓存
   * @param module 模块名
   * @param entityName 实体名称
   * @param queryHash 查询条件哈希
   */
  static listCache(
    module: string,
    entityName: string,
    queryHash: string,
  ): string {
    return `${RedisKeyPrefix.CACHE}:${module}:${entityName}:list:${queryHash}`;
  }
}

/**
 * Redis 键匹配模式
 * 用于批量查询或删除操作
 */
export class RedisKeyPattern {
  /**
   * 所有认证模块的键
   */
  static readonly ALL_AUTH_KEYS = `${RedisKeyPrefix.AUTH}:*`;

  /**
   * 所有用户模块的键
   */
  static readonly ALL_USER_KEYS = `${RedisKeyPrefix.USER}:*`;

  /**
   * 所有系统模块的键
   */
  static readonly ALL_SYSTEM_KEYS = `${RedisKeyPrefix.SYSTEM}:*`;

  /**
   * 所有缓存模块的键
   */
  static readonly ALL_CACHE_KEYS = `${RedisKeyPrefix.CACHE}:*`;

  /**
   * 特定用户的所有键
   * @param userId 用户ID
   */
  static allUserRelatedKeys(userId: string): string {
    return `*:*:${userId}:*`;
  }
}
