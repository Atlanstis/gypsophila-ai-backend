import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from './data-source';
import { TransactionService } from './transaction.service';

/**
 * 数据库模块
 * 集成TypeORM，使用共享数据源配置
 * 支持应用程序和数据库迁移工具使用同一配置
 */
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class DatabaseModule {}
