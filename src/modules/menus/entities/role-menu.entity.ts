import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Menu } from './menu.entity';

/**
 * 角色菜单关联实体
 */
@Entity('role_menus')
export class RoleMenu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'menu_id', nullable: false })
  menuId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

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
}
