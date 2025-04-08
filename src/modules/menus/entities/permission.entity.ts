import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TimeEntity } from 'src/common';

import { RolePermission } from '../../roles/entities';
import {
  PERMISSION_KEY_MAX_LENGTH,
  PERMISSION_NAME_MAX_LENGTH,
} from '../menus.constants';
import { IPermissionEntity } from '../types';
import { Menu } from './menu.entity';

/**
 * 权限实体
 */
@Entity('permissions')
export class Permission extends TimeEntity implements IPermissionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'menu_id', nullable: false })
  menuId: number;

  @Column({ length: PERMISSION_KEY_MAX_LENGTH, nullable: false, unique: true })
  key: string;

  @Column({ length: PERMISSION_NAME_MAX_LENGTH, nullable: false })
  name: string;

  @ManyToOne(() => Menu, (menu) => menu.permissions)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  rolePermissions: RolePermission[];
}
