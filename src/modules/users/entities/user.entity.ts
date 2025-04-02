import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TimeEntity } from 'src/common';

import { UserRole } from '../../roles/entities/user-role.entity';
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
export class User extends TimeEntity {
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
  auths: UserAuth[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
