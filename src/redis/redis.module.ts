import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { LoggerModule } from '../logger/logger.module';

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
