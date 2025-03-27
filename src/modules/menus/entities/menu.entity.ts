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
export class Menu {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ length: 100, nullable: false, unique: true })
  key: string;

  @Column({ length: 100, nullable: false })
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

  @Column({ length: 255, nullable: false })
  path: string;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @Column({ name: 'is_cached', default: false })
  isCached: boolean;

  @Column({ length: 100, nullable: true })
  layout: string;

  @Column({
    type: 'enum',
    enum: MenuModule,
    default: MenuModule.ADMIN,
  })
  module: MenuModule;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
