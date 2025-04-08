import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TimeEntity } from 'src/common';

import { Permission } from '../../menus/entities/permission.entity';
import { IRolePermissionEntity } from '../types/entity.types';
import { Role } from './role.entity';

/**
 * 角色权限关联实体
 */
@Entity('role_permissions')
export class RolePermission
  extends TimeEntity
  implements IRolePermissionEntity
{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'permission_id', nullable: false })
  permissionId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
