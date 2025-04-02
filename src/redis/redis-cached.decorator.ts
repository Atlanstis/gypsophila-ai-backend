import { SetMetadata } from '@nestjs/common';

/**
 * Redis 缓存配置选项
 */
export interface RedisCacheOptions {
  /**
   * 缓存键模板 (例如: "cache:user:{0}:{1}")
   * {0}、{1} 等将被方法参数替换
   */
  key: string;

  /**
   * 缓存过期时间(秒)
   */
  ttl: number;

  /**
   * 是否使用JSON序列化
   * @default true
   */
  useJson?: boolean;
}

/**
 * Redis 缓存装饰器元数据键
 */
export const REDIS_CACHE_METADATA = 'redis_cache_metadata';

/**
 * 装饰器 - 指示方法结果应该被缓存到 Redis
 *
 * 使用示例:
 * ```typescript
 * @RedisCached({
 *   key: 'user:info:{0}',  // {0} 将被替换为方法的第一个参数
 *   ttl: 3600,             // 缓存 1 小时
 * })
 * async getUserInfo(userId: string): Promise<UserInfo> {
 *   // 方法逻辑
 * }
 * ```
 *
 * 需配合 RedisInterceptor 使用
 */
export const RedisCached = (options: RedisCacheOptions) =>
  SetMetadata(REDIS_CACHE_METADATA, options);
