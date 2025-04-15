import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role, RolePermission, UserRole } from './entities';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

/**
 * 角色模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, RolePermission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
