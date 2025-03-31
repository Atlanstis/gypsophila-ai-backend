import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { MenusModule } from './modules/menus/menus.module';
import { HttpStatusInterceptor } from './common/interceptors/http-status.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
    RedisModule,
    UsersModule,
    RolesModule,
    MenusModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpStatusInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用请求日志中间件到所有路由
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
