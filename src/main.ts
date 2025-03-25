import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取日志记录器
  const logger = app.get(LoggerService);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 获取配置服务
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');
  const securityConfig = configService.get('security');

  // 设置全局前缀
  app.setGlobalPrefix(appConfig.prefix);

  // 配置安全中间件
  if (securityConfig.helmet.enabled) {
    app.use(helmet());
  }

  // 配置压缩中间件
  if (securityConfig.compression.enabled) {
    app.use(compression());
  }

  // 配置速率限制中间件
  if (securityConfig.rateLimiter.enabled) {
    app.use(
      rateLimit({
        windowMs: securityConfig.rateLimiter.windowMs,
        max: securityConfig.rateLimiter.max,
      }),
    );
  }

  // 配置CORS
  const corsConfig = configService.get('cors');
  if (corsConfig.enabled) {
    app.enableCors({
      origin: corsConfig.origin,
      methods: corsConfig.methods.split(','),
      credentials: corsConfig.credentials,
    });
  }

  // 启动应用
  await app.listen(appConfig.port);
  logger.info(`应用已启动，端口：${appConfig.port}`, 'Bootstrap');
}

bootstrap();
