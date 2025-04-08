import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BusinessException } from 'src/common';

import { TransactionService } from '../../database/transaction.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { QueryRoleListResponse } from './types/api.types';
import { IRoleEntity } from './types/entity.types';

/**
 * 角色服务
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto): Promise<void> {
    // 检查角色名是否存在
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (existingRole) {
      throw new BusinessException(`角色名 ${createRoleDto.name} 已存在`);
    }

    // 使用事务创建角色
    await this.transactionService.executeTransaction(async (manager) => {
      // 创建角色，isBuiltin 始终为 false
      manager.create(Role, {
        name: createRoleDto.name,
        description: createRoleDto.description,
        isBuiltin: false, // 创建的角色始终为非内置角色
      });
    });
  }

  /**
   * 查询角色列表
   */
  async findAll(query: QueryRoleDto): Promise<QueryRoleListResponse['data']> {
    const {
      name,
      isBuiltin,
      pageSize = 10,
      page = 1,
      sortBy,
      sortOrder,
    } = query;

    // 构建查询条件
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    // 根据条件过滤
    if (name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${name}%` });
    }

    if (isBuiltin !== undefined) {
      queryBuilder.andWhere('role.isBuiltin = :isBuiltin', { isBuiltin });
    }

    // 排序
    if (sortBy) {
      const order = sortOrder || 'DESC';
      queryBuilder.orderBy(`role.${sortBy}`, order);
    } else {
      queryBuilder.orderBy('role.id', 'DESC');
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
   * 查询单个角色
   */
  async findOne(id: number): Promise<IRoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['userRoles', 'roleMenus', 'rolePermissions'],
    });

    if (!role) {
      throw new BusinessException(`角色ID ${id} 不存在`);
    }

    return role;
  }

  /**
   * 更新角色
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<void> {
    const role = await this.findOne(id);

    // 如果更新角色名，检查是否已存在
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existingRole) {
        throw new BusinessException(`角色名 ${updateRoleDto.name} 已存在`);
      }
    }

    // 使用事务更新角色
    await this.transactionService.executeTransaction(async (manager) => {
      // 更新角色基本信息
      if (updateRoleDto.name) role.name = updateRoleDto.name;
      if (updateRoleDto.description !== undefined)
        role.description = updateRoleDto.description;

      // 保存角色信息
      await manager.save(role);
    });
  }

  /**
   * 删除角色
   */
  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    // 检查是否为内置角色
    if (role.isBuiltin) {
      throw new BusinessException('不能删除内置角色');
    }

    // 使用事务删除角色
    await this.transactionService.executeTransaction(async (manager) => {
      // 删除角色
      await manager.remove(role);
    });
  }
}
