import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggerModule } from '../logger/logger.module';
import { RedisCacheInterceptor } from './redis-cache.interceptor';
import { RedisHelperService } from './redis-helper.service';
import { RedisService } from './redis.service';

/**
 * Redis模块
 * 提供Redis连接和操作服务
 */
@Global()
@Module({
  imports: [LoggerModule],
  providers: [
    RedisService,
    RedisHelperService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisCacheInterceptor,
    },
  ],
  exports: [RedisService, RedisHelperService],
})
export class RedisModule {}
