import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Menu } from './menu.entity';
import { TimeEntity } from '../../../common/entities/time.entity';

/**
 * 角色菜单关联实体
 */
@Entity('role_menus')
export class RoleMenu extends TimeEntity {
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
}
