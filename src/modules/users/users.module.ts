import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from 'src/database/database.module';

import { User } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * 用户模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
