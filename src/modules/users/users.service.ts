import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user-auth.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { AuthType } from './entities/user-auth.entity';
import { TransactionService } from '../../database/transaction.service';

/**
 * 用户服务
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查登录用户名是否存在
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUserByUsername) {
      throw new BadRequestException(
        `登录用户名 ${createUserDto.username} 已存在`,
      );
    }

    // 使用事务执行用户创建
    return this.transactionService.executeTransaction(async (manager) => {
      // 创建用户
      const user = manager.create(User, {
        username: createUserDto.username,
        name: createUserDto.name,
        avatar: createUserDto.avatar,
        isBuiltin: createUserDto.isBuiltin || false,
      });

      // 保存用户信息
      const savedUser = await manager.save(user);

      // 创建用户认证信息
      const passwordHash = await argon2.hash(createUserDto.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 4,
      });
      const userAuth = manager.create(UserAuth, {
        userId: savedUser.id,
        authType: AuthType.PASSWORD,
        authData: passwordHash,
      });

      // 保存用户认证信息
      await manager.save(userAuth);

      return savedUser;
    });
  }

  /**
   * 查询用户列表
   */
  async findAll(
    query: QueryUserDto,
  ): Promise<{ total: number; items: User[] }> {
    const { username, name, isBuiltin, pageSize = 10, current = 1 } = query;

    // 构建查询条件
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // 根据条件过滤
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    if (name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }

    if (isBuiltin !== undefined) {
      queryBuilder.andWhere('user.isBuiltin = :isBuiltin', { isBuiltin });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页查询
    const items = await queryBuilder
      .orderBy('user.id', 'DESC')
      .skip((current - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { total, items };
  }

  /**
   * 查询单个用户
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['auths', 'userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(`用户ID ${id} 不存在`);
    }

    return user;
  }

  /**
   * 更新用户
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 如果更新登录用户名，检查是否已存在
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new BadRequestException(
          `登录用户名 ${updateUserDto.username} 已存在`,
        );
      }
    }

    // 使用事务执行用户更新
    return this.transactionService.executeTransaction(async (manager) => {
      // 更新用户基本信息
      if (updateUserDto.username) user.username = updateUserDto.username;
      if (updateUserDto.name) user.name = updateUserDto.name;
      if (updateUserDto.avatar !== undefined)
        user.avatar = updateUserDto.avatar;
      if (updateUserDto.isBuiltin !== undefined)
        user.isBuiltin = updateUserDto.isBuiltin;

      // 保存用户信息
      await manager.save(user);

      // 如果需要更新密码
      if (updateUserDto.password) {
        // 查找用户的密码认证信息
        const auth = await manager.findOne(UserAuth, {
          where: { userId: user.id, authType: AuthType.PASSWORD },
        });

        // 生成密码哈希
        const passwordHash = await argon2.hash(updateUserDto.password, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16,
          timeCost: 3,
          parallelism: 4,
        });

        if (auth) {
          // 更新密码
          auth.authData = passwordHash;
          await manager.save(auth);
        } else {
          // 如果没有密码认证信息，创建一个
          const userAuth = manager.create(UserAuth, {
            userId: user.id,
            authType: AuthType.PASSWORD,
            authData: passwordHash,
          });
          await manager.save(userAuth);
        }
      }

      // 重新查询用户信息
      return manager.findOne(User, {
        where: { id },
        relations: ['auths', 'userRoles', 'userRoles.role'],
      });
    });
  }

  /**
   * 删除用户
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    // 检查是否为内置用户
    if (user.isBuiltin) {
      throw new BadRequestException('不能删除内置用户');
    }

    // 使用事务执行用户删除
    await this.transactionService.executeTransaction(async (manager) => {
      // 先删除用户认证信息
      await manager.delete(UserAuth, { userId: id });

      // 再删除用户
      await manager.remove(user);
    });
  }
}
