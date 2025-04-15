import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from 'src/modules/roles/entities';

import { IUserRoleEntity } from '../types';
import { User } from './user.entity';

/**
 * 用户角色关联实体
 */
@Entity('user_roles')
export class UserRole implements IUserRoleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @ManyToOne(() => User, (user) => user.userRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

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
}
