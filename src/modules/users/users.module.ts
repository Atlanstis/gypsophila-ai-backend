import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionService } from 'src/database/transaction.service';
import { Role } from 'src/modules/roles/entities';

import { User } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * 用户模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, TransactionService],
  exports: [UsersService],
})
export class UsersModule {}
