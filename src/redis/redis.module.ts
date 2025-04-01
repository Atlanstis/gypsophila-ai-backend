import { Global, Module } from '@nestjs/common';

import { LoggerModule } from '../logger/logger.module';
import { RedisService } from './redis.service';

/**
 * Redis模块
 * 提供Redis连接和操作服务
 */
@Global()
@Module({
  imports: [LoggerModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
