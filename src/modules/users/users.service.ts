import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BusinessException } from 'src/common';
import { TransactionService } from 'src/database/transaction.service';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { User, UserAuth } from './entities';
import { AuthType, QueryUserListResponse } from './types';

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
   * 生成密码哈希
   * @param password 明文密码
   * @returns 哈希后的密码
   */
  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: 2, // argon2id
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 4,
    });
  }

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto): Promise<void> {
    // 检查登录用户名是否存在
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUserByUsername) {
      throw new BusinessException(
        `登录用户名 ${createUserDto.username} 已存在`,
      );
    }

    // 使用事务执行用户创建
    await this.transactionService.executeTransaction(async (manager) => {
      // 创建用户
      const user = manager.create(User, {
        username: createUserDto.username,
        nickname: createUserDto.nickname,
        avatar: createUserDto.avatar,
        isBuiltin: false,
      });

      // 保存用户信息
      const savedUser = await manager.save(user);

      // 创建用户认证信息
      const passwordHash = await this.hashPassword(createUserDto.password);

      const userAuth = manager.create(UserAuth, {
        userId: savedUser.id,
        authType: AuthType.PASSWORD,
        authData: passwordHash,
      });

      // 保存用户认证信息
      await manager.save(userAuth);
    });
  }

  /**
   * 查询用户列表
   */
  async findAll(query: QueryUserDto): Promise<QueryUserListResponse['data']> {
    const {
      username,
      nickname,
      pageSize = 10,
      page = 1,
      sortBy,
      sortOrder,
    } = query;

    // 构建查询条件
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // 根据条件过滤
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    if (nickname) {
      queryBuilder.andWhere('user.nickname LIKE :nickname', {
        nickname: `%${nickname}%`,
      });
    }

    // 排序
    if (sortBy) {
      const order = sortOrder || 'DESC';
      queryBuilder.orderBy(`user.${sortBy}`, order);
    } else {
      queryBuilder.orderBy('user.id', 'DESC');
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页查询
    const items = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // 返回分页数据
    return {
      items,
      total,
      page,
      pageSize,
    };
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
      throw new BusinessException(`用户ID ${id} 不存在`);
    }

    return user;
  }

  /**
   * 更新用户
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['auths', 'userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new BusinessException(`用户ID ${id} 不存在`);
    }

    // 如果更新登录用户名，检查是否已存在
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new BusinessException(
          `登录用户名 ${updateUserDto.username} 已存在`,
        );
      }
    }

    // 使用事务执行用户更新
    await this.transactionService.executeTransaction(async (manager) => {
      // 更新用户基本信息
      if (updateUserDto.username) user.username = updateUserDto.username;
      if (updateUserDto.nickname) user.nickname = updateUserDto.nickname;
      if (updateUserDto.avatar !== undefined)
        user.avatar = updateUserDto.avatar;

      // 保存用户信息
      await manager.save(user);

      // 如果需要更新密码
      if (updateUserDto.password) {
        // 查找用户的密码认证信息
        const auth = await manager.findOne(UserAuth, {
          where: { userId: user.id, authType: AuthType.PASSWORD },
        });

        // 生成密码哈希
        const passwordHash = await this.hashPassword(updateUserDto.password);

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
    });
  }

  /**
   * 删除用户
   */
  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BusinessException(`用户ID ${id} 不存在`);
    }

    // 检查是否为内置用户
    if (user.isBuiltin) {
      throw new BusinessException('不能删除内置用户');
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
