import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './entities/menu.entity';
import { Permission } from './entities/permission.entity';
import { RoleMenu } from './entities/role-menu.entity';
import { DatabaseModule } from '../../database/database.module';
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
