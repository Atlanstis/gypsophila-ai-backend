import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { RoleMenu } from '../../menus/entities/role-menu.entity';
import { RolePermission } from './role-permission.entity';
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
} from '../constants';

/**
 * 角色实体
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: ROLE_NAME_MAX_LENGTH, nullable: false, unique: true })
  name: string;

  @Column({ length: ROLE_DESCRIPTION_MAX_LENGTH, nullable: true })
  description: string;

  @Column({ name: 'is_builtin', default: false })
  isBuiltin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RoleMenu, (roleMenu) => roleMenu.role)
  roleMenus: RoleMenu[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
