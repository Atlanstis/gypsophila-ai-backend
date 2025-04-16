import * as argon2 from 'argon2';
import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BusinessException, compareArrays } from 'src/common';
import { TransactionService } from 'src/database/transaction.service';
import { Role } from 'src/modules/roles/entities';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { User, UserAuth, UserRole } from './entities';
import { AuthType, QueryUserListResponse } from './types';

/**
 * 用户服务
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
   * 验证角色
   * @param roleIds 角色ID列表
   * @returns 角色列表
   */
  private async validateRoles(roleIds: number[]): Promise<Role[]> {
    const roles = await this.roleRepository.findBy({ id: In(roleIds) });

    // 检查是否所有角色都存在
    if (roles.length !== roleIds.length) {
      throw new BusinessException('存在无效的角色ID');
    }

    // 检查是否包含内置角色
    const builtinRole = roles.find((role) => role.isBuiltin);
    if (builtinRole) {
      throw new BusinessException(`不能分配内置角色 ${builtinRole.name}`);
    }

    return roles;
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

    // 验证角色
    await this.validateRoles(createUserDto.roles);

    // 使用事务执行用户创建
    await this.transactionService.executeTransaction(async (manager) => {
      // 创建用户
      const user = manager.create(User, {
        username: createUserDto.username,
        nickname: createUserDto.nickname,
        avatar: createUserDto.avatar,
        isBuiltin: false, // 无法创建内置用户
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

      // 创建用户角色关联
      for (const roleId of createUserDto.roles) {
        const userRole = manager.create(UserRole, {
          userId: savedUser.id,
          roleId,
        });
        await manager.save(userRole);
      }
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
      queryBuilder.orderBy('user.createdAt', 'ASC');
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
      relations: ['userRoles', 'userRoles.role'],
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
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BusinessException(`用户ID ${id} 不存在`);
    }

    // 检查是否为内置用户
    if (user.isBuiltin) {
      throw new BusinessException('不能修改内置用户');
    }

    // 使用事务执行用户更新
    await this.transactionService.executeTransaction(async (manager) => {
      // 更新用户基本信息
      if (updateUserDto.nickname) user.nickname = updateUserDto.nickname;
      if (updateUserDto.avatar !== undefined)
        user.avatar = updateUserDto.avatar;

      // 保存用户信息
      await manager.save(user);

      // 如果更新角色
      if (updateUserDto.roles) {
        // 验证角色
        await this.validateRoles(updateUserDto.roles);

        // 获取旧的用户角色关联
        const userRoles = await manager.find(UserRole, {
          where: { userId: id },
        });

        //  比对前后角色ID列表
        const oldRoleIds = userRoles.map((userRole) => userRole.roleId);
        const newRoleIds = updateUserDto.roles;
        const { itemsToDelete: deleteRoleIds, itemsToAdd: addRoleIds } =
          compareArrays(oldRoleIds, newRoleIds);

        // 删除需要删除的角色关联
        await manager.delete(UserRole, {
          userId: id,
          roleId: In(deleteRoleIds),
        });

        // 创建新的角色关联
        for (const roleId of addRoleIds) {
          const userRole = manager.create(UserRole, {
            userId: id,
            roleId,
          });
          await manager.save(userRole);
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

      // 再删除用户角色关联
      await manager.delete(UserRole, { userId: id });

      // 再删除用户
      await manager.remove(user);
    });
  }
}
