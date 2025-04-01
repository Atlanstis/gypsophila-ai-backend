import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TimeEntity } from '../../../common/entities/time.entity';
import {
  MENU_ICON_MAX_LENGTH,
  MENU_KEY_MAX_LENGTH,
  MENU_LAYOUT_MAX_LENGTH,
  MENU_NAME_MAX_LENGTH,
  MENU_PATH_MAX_LENGTH,
} from '../constants';
import { Permission } from './permission.entity';
import { RoleMenu } from './role-menu.entity';

/**
 * 菜单类型
 */
export enum MenuType {
  DIRECTORY = 'directory',
  PAGE = 'page',
}

/**
 * 菜单所属模块
 */
export enum MenuModule {
  ADMIN = 'admin',
}

/**
 * 菜单实体
 */
@Entity('menus')
export class Menu extends TimeEntity {
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
}
