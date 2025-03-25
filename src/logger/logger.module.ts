import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { createLoggerConfig } from './logger.config';
import { LoggerService } from './logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
