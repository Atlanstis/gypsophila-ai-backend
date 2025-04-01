import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../../database/database.module';
import { Menu } from './entities/menu.entity';
import { Permission } from './entities/permission.entity';
import { RoleMenu } from './entities/role-menu.entity';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

/**
 * 菜单模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, Permission, RoleMenu]),
    DatabaseModule,
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
