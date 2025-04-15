import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleMenu } from 'src/modules/menus/entities';
import { UserRole } from 'src/modules/users/entities';

import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
} from '../roles.constants';
import { IRoleEntity } from '../types/entity.types';
import { RolePermission } from './role-permission.entity';

/**
 * 角色实体
 */
@Entity('roles')
export class Role implements IRoleEntity {
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

  /**
   * 创建时间
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;
}
