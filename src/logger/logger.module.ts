import { WinstonModule } from 'nest-winston';

import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { createLoggerConfig } from './logger.config';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createLoggerConfig(configService),
    }),
  ],
  providers: [LoggerService],
  exports: [WinstonModule, LoggerService],
})
export class LoggerModule {}
