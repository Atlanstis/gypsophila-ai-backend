import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';
import { UserRole } from '../../roles/entities/user-role.entity';
import {
  USER_AVATAR_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
} from '../constants';

/**
 * 用户实体
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: USER_AVATAR_MAX_LENGTH, nullable: true })
  avatar: string;

  @Column({ length: USERNAME_MAX_LENGTH, nullable: false, unique: true })
  username: string;

  @Column({ length: USER_NAME_MAX_LENGTH, nullable: false })
  name: string;

  @Column({ name: 'is_builtin', default: false })
  isBuiltin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.user)
  auths: UserAuth[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
