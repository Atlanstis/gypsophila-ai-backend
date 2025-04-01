import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TimeEntity } from '../../../common/entities/time.entity';
import { RolePermission } from '../../roles/entities/role-permission.entity';
import { Menu } from './menu.entity';

/**
 * 权限实体
 */
@Entity('permissions')
export class Permission extends TimeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'menu_id', nullable: false })
  menuId: number;

  @Column({ length: 32, nullable: false, unique: true })
  key: string;

  @Column({ length: 16, nullable: false })
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
