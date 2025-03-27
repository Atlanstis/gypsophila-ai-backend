import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from './menu.entity';
import { RolePermission } from '../../roles/entities/role-permission.entity';

/**
 * 权限实体
 */
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'menu_id', nullable: false })
  menuId: number;

  @Column({ length: 100, nullable: false, unique: true })
  key: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
