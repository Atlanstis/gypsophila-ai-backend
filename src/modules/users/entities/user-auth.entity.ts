import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 用户认证方式
 */
export enum AuthType {
  PASSWORD = 'password',
}

/**
 * 用户认证实体
 */
@Entity('user_auths')
export class UserAuth {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.auths, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
