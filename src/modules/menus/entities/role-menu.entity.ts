import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { IRoleMenuEntity } from '../types/entity.types';
import { Menu } from './menu.entity';

/**
 * 角色菜单关联实体
 */
@Entity('role_menus')
export class RoleMenu implements IRoleMenuEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'menu_id', nullable: false })
  menuId: number;

  @ManyToOne(() => Role, (role) => role.roleMenus, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Menu, (menu) => menu.roleMenus, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

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
