import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TimeEntity } from 'src/common';

import { RoleMenu } from '../../menus/entities/role-menu.entity';
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
} from '../roles.constants';
import { IRoleEntity } from '../types/entity.types';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

/**
 * 角色实体
 */
@Entity('roles')
export class Role extends TimeEntity implements IRoleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: ROLE_NAME_MAX_LENGTH, nullable: false, unique: true })
  name: string;

  @Column({ length: ROLE_DESCRIPTION_MAX_LENGTH, nullable: true })
  description: string;

  @Column({ name: 'is_builtin', default: false })
  isBuiltin: boolean;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RoleMenu, (roleMenu) => roleMenu.role)
  roleMenus: RoleMenu[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
