import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TimeEntity } from '../../../common/entities/time.entity';

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
export class UserAuth extends TimeEntity {
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
  user: User;
}
