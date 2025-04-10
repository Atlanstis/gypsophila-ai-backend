import { Global, Module } from '@nestjs/common';

import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';

import { RsaService } from './rsa.service';

/**
 * RSA 加密模块
 * 提供全局可用的 RSA 加密解密服务
 */
@Global()
@Module({
  imports: [RedisModule, ConfigModule],
  providers: [
    {
      provide: RsaService,
      useFactory: (
        redisService: RedisService,
        configService: ConfigService,
      ) => {
        return new RsaService(configService, redisService);
      },
      inject: [RedisService, ConfigService],
    },
  ],
  exports: [RsaService],
})
export class RsaModule {}
