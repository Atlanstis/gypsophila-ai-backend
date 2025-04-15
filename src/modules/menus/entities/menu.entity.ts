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

import {
  MENU_ICON_MAX_LENGTH,
  MENU_KEY_MAX_LENGTH,
  MENU_LAYOUT_MAX_LENGTH,
  MENU_NAME_MAX_LENGTH,
  MENU_PATH_MAX_LENGTH,
} from '../menus.constants';
import { IMenuEntity, MenuModule, MenuType } from '../types/entity.types';
import { Permission } from './permission.entity';
import { RoleMenu } from './role-menu.entity';

/**
 * 菜单实体
 */
@Entity('menus')
export class Menu implements IMenuEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: MENU_KEY_MAX_LENGTH, nullable: false, unique: true })
  key: string;

  @Column({ length: MENU_NAME_MAX_LENGTH, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: MenuType,
    default: MenuType.DIRECTORY,
  })
  type: MenuType;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'order_num', default: 0 })
  orderNum: number;

  @Column({ length: MENU_PATH_MAX_LENGTH, nullable: false })
  path: string;

  @Column({ length: MENU_ICON_MAX_LENGTH, nullable: true })
  icon: string;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @Column({ name: 'is_cached', default: false })
  isCached: boolean;

  @Column({ length: MENU_LAYOUT_MAX_LENGTH, nullable: true })
  layout: string;

  @Column({
    type: 'enum',
    enum: MenuModule,
    default: MenuModule.ADMIN,
  })
  module: MenuModule;

  @ManyToOne(() => Menu, (menu) => menu.children, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @OneToMany(() => Permission, (permission) => permission.menu)
  permissions: Permission[];

  @OneToMany(() => RoleMenu, (roleMenu) => roleMenu.menu)
  roleMenus: RoleMenu[];

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
