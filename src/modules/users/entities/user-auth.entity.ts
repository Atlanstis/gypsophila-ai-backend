import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthType, IUserAuthEntity } from '../types/entity.types';
import { User } from './user.entity';

/**
 * 用户认证实体
 */
@Entity('user_auths')
export class UserAuth implements IUserAuthEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({
    name: 'auth_type',
    type: 'enum',
    enum: AuthType,
    default: AuthType.PASSWORD,
  })
  authType: AuthType;

  @Column({ name: 'auth_data', type: 'text', nullable: false })
  authData: string;

  @ManyToOne(() => User, (user) => user.auths, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

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
