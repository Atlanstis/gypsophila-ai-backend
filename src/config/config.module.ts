import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

/**
 * 配置模块
 * 使用@Global()装饰器使其成为全局模块
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
