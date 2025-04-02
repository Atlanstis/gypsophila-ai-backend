import { Observable, from, of, switchMap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from '../logger/logger.service';
import {
  REDIS_CACHE_METADATA,
  RedisCacheOptions,
} from './redis-cached.decorator';
import { RedisService } from './redis.service';

/**
 * Redis 缓存拦截器
 * 配合 @RedisCached 装饰器使用，实现方法结果的自动缓存
 */
@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 拦截方法调用，实现缓存逻辑
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // 获取缓存配置
    const cacheOptions = this.reflector.get<RedisCacheOptions>(
      REDIS_CACHE_METADATA,
      context.getHandler(),
    );

    // 如果没有缓存配置，直接执行原方法
    if (!cacheOptions) {
      return next.handle();
    }

    const { key: keyTemplate, ttl, useJson = true } = cacheOptions;

    // 获取方法参数，用于替换缓存键模板中的占位符
    const args = context.getArgs();
    const methodArgs =
      args.length && typeof args[0] === 'object' && !Array.isArray(args[0])
        ? [args[0]] // 如果第一个参数是对象(请求对象)，只使用它
        : args;

    // 构建缓存键
    const cacheKey = this.buildCacheKey(keyTemplate, methodArgs);

    // 尝试从缓存获取
    try {
      const cachedValue = await this.redisService.get(cacheKey);

      // 如果缓存存在，直接返回
      if (cachedValue) {
        this.logger.debug(
          `Redis缓存命中: ${cacheKey}`,
          'RedisCacheInterceptor',
        );
        return of(useJson ? JSON.parse(cachedValue) : cachedValue);
      }

      // 缓存不存在，执行原方法
      return next.handle().pipe(
        switchMap((data) => {
          return from(this.cacheResult(cacheKey, data, ttl, useJson)).pipe(
            switchMap(() => of(data)),
          );
        }),
      );
    } catch (error) {
      this.logger.error(
        `Redis缓存操作失败: ${error.message}`,
        'RedisCacheInterceptor',
      );
      return next.handle(); // 出错时仍执行原方法
    }
  }

  /**
   * 构建缓存键
   * @param template 键模板 (例如 "cache:user:{0}:{1}")
   * @param args 方法参数，用于替换模板中的 {0}、{1} 等占位符
   */
  private buildCacheKey(template: string, args: any[]): string {
    let cacheKey = template;
    args.forEach((arg, index) => {
      // 如果参数是对象，使用其唯一标识符或转为JSON
      const value =
        typeof arg === 'object' && arg !== null
          ? arg.id || JSON.stringify(arg)
          : String(arg);
      cacheKey = cacheKey.replace(`{${index}}`, value);
    });
    return cacheKey;
  }

  /**
   * 缓存方法执行结果
   */
  private async cacheResult(
    key: string,
    data: any,
    ttl: number,
    useJson: boolean,
  ): Promise<void> {
    try {
      const value = useJson ? JSON.stringify(data) : data;
      await this.redisService.set(key, value, ttl);
      this.logger.debug(
        `已缓存数据, key: ${key}, ttl: ${ttl}秒`,
        'RedisCacheInterceptor',
      );
    } catch (error) {
      this.logger.error(
        `缓存数据失败: ${error.message}`,
        'RedisCacheInterceptor',
      );
    }
  }
}
