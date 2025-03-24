import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import * as helmet from 'helmet';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取配置服务
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');
  const securityConfig = configService.get('security');

  // 设置全局前缀
  app.setGlobalPrefix(appConfig.prefix);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 配置安全中间件
  if (securityConfig.helmet.enabled) {
    app.use(helmet);
  }

  if (securityConfig.compression.enabled) {
    app.use(compression());
  }

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
  console.log(`应用已启动: ${appConfig.url}${appConfig.prefix}`);
}

bootstrap();
