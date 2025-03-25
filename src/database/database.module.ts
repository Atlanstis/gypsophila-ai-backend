import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';

/**
 * 数据库模块
 * 集成TypeORM，从配置文件读取数据库配置
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');

        return {
          type: dbConfig.type as any,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
