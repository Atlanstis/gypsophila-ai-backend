import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../../database/database.module';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

/**
 * 角色模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Role, UserRole, RolePermission]),
    DatabaseModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
