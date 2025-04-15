import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../../roles/entities/user-role.entity';
import { IUserEntity } from '../types/entity.types';
import {
  NICKNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USER_AVATAR_MAX_LENGTH,
} from '../users.constants';
import { UserAuth } from './user-auth.entity';

/**
 * 用户实体
 */
@Entity('users')
export class User implements IUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: USER_AVATAR_MAX_LENGTH, nullable: true })
  avatar: string;

  @Column({ length: USERNAME_MAX_LENGTH, nullable: false, unique: true })
  username: string;

  @Column({ length: NICKNAME_MAX_LENGTH, nullable: false })
  nickname: string;

  @Column({ name: 'is_builtin', default: false })
  isBuiltin: boolean;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.user)
  auths?: UserAuth[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles?: UserRole[];

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
