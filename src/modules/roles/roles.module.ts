import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { DatabaseModule } from '../../database/database.module';
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
