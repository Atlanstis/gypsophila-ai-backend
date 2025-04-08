import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionService } from '../../database/transaction.service';
import { Menu, Permission, RoleMenu } from './entities';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

/**
 * 菜单模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([Menu, Permission, RoleMenu])],
  controllers: [MenusController],
  providers: [MenusService, TransactionService],
  exports: [MenusService],
})
export class MenusModule {}
