import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { UserAuth } from '../users/entities/user-auth.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RsaService } from './rsa.service';

/**
 * 认证模块
 * 提供用户认证和数据加密相关的功能
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAuth]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt', 'secret'),
        signOptions: {
          expiresIn: configService.get('jwt', 'expiresIn'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
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
    AuthService,
  ],
  exports: [AuthService, RsaService],
})
export class AuthModule {}
