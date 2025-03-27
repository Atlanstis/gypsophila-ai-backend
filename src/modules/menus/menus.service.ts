import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Permission } from './entities/permission.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { TransactionService } from '../../database/transaction.service';

/**
 * 菜单服务
 */
@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * 创建菜单
   */
  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    // 检查菜单key是否存在
    const existingMenu = await this.menuRepository.findOne({
      where: { key: createMenuDto.key },
    });
    if (existingMenu) {
      throw new BadRequestException(`菜单Key ${createMenuDto.key} 已存在`);
    }

    // 如果有父级菜单，检查父级菜单是否存在
    if (createMenuDto.parentId) {
      const parentMenu = await this.menuRepository.findOne({
        where: { id: createMenuDto.parentId },
      });
      if (!parentMenu) {
        throw new BadRequestException(
          `父级菜单ID ${createMenuDto.parentId} 不存在`,
        );
      }
    }

    // 使用事务创建菜单
    return this.transactionService.executeTransaction(async (manager) => {
      // 创建菜单
      const menu = manager.create(Menu, {
        key: createMenuDto.key,
        name: createMenuDto.name,
        type: createMenuDto.type,
        parentId: createMenuDto.parentId,
        orderNum: createMenuDto.orderNum || 0,
        path: createMenuDto.path,
        icon: createMenuDto.icon,
        isVisible:
          createMenuDto.isVisible !== undefined
            ? createMenuDto.isVisible
            : true,
        isCached:
          createMenuDto.isCached !== undefined ? createMenuDto.isCached : false,
        layout: createMenuDto.layout,
        module: createMenuDto.module,
      });

      // 保存菜单信息
      return await manager.save(menu);
    });
  }

  /**
   * 查询菜单列表（树形结构）
   */
  async findAllMenus(query: QueryMenuDto): Promise<Menu[]> {
    const { key, name, type, parentId, isVisible, module } = query;

    // 构建查询条件
    const queryBuilder = this.menuRepository.createQueryBuilder('menu');

    // 根据条件过滤
    if (key) {
      queryBuilder.andWhere('menu.key LIKE :key', { key: `%${key}%` });
    }

    if (name) {
      queryBuilder.andWhere('menu.name LIKE :name', { name: `%${name}%` });
    }

    if (type) {
      queryBuilder.andWhere('menu.type = :type', { type });
    }

    if (parentId !== undefined) {
      queryBuilder.andWhere('menu.parentId = :parentId', { parentId });
    }

    if (isVisible !== undefined) {
      queryBuilder.andWhere('menu.isVisible = :isVisible', { isVisible });
    }

    if (module) {
      queryBuilder.andWhere('menu.module = :module', { module });
    }

    // 获取所有菜单
    const menus = await queryBuilder
      .orderBy('menu.orderNum', 'ASC')
      .addOrderBy('menu.id', 'ASC')
      .getMany();

    // 构建树形结构
    const menuTree = this.buildMenuTree(menus);

    return menuTree;
  }

  /**
   * 构建菜单树
   */
  private buildMenuTree(menus: Menu[], parentId: number = null): Menu[] {
    const result: Menu[] = [];

    for (const menu of menus) {
      if (menu.parentId === parentId) {
        const children = this.buildMenuTree(menus, menu.id);
        if (children.length > 0) {
          menu.children = children;
        }
        result.push(menu);
      }
    }

    return result;
  }

  /**
   * 查询单个菜单
   */
  async findOneMenu(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['permissions', 'parent', 'children', 'roleMenus'],
    });

    if (!menu) {
      throw new NotFoundException(`菜单ID ${id} 不存在`);
    }

    return menu;
  }

  /**
   * 更新菜单
   */
  async updateMenu(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOneMenu(id);

    // 如果更新菜单key，检查是否已存在
    if (updateMenuDto.key && updateMenuDto.key !== menu.key) {
      const existingMenu = await this.menuRepository.findOne({
        where: { key: updateMenuDto.key },
      });
      if (existingMenu) {
        throw new BadRequestException(`菜单Key ${updateMenuDto.key} 已存在`);
      }
    }

    // 如果更新父级菜单，检查父级菜单是否存在
    if (updateMenuDto.parentId && updateMenuDto.parentId !== menu.parentId) {
      const parentMenu = await this.menuRepository.findOne({
        where: { id: updateMenuDto.parentId },
      });
      if (!parentMenu) {
        throw new BadRequestException(
          `父级菜单ID ${updateMenuDto.parentId} 不存在`,
        );
      }

      // 检查是否将菜单设置为自己的子菜单
      if (updateMenuDto.parentId === menu.id) {
        throw new BadRequestException('不能将菜单设置为自己的子菜单');
      }
    }

    // 使用事务更新菜单
    return this.transactionService.executeTransaction(async (manager) => {
      // 更新菜单基本信息
      if (updateMenuDto.key) menu.key = updateMenuDto.key;
      if (updateMenuDto.name) menu.name = updateMenuDto.name;
      if (updateMenuDto.type) menu.type = updateMenuDto.type;
      if (updateMenuDto.parentId !== undefined)
        menu.parentId = updateMenuDto.parentId;
      if (updateMenuDto.orderNum !== undefined)
        menu.orderNum = updateMenuDto.orderNum;
      if (updateMenuDto.path) menu.path = updateMenuDto.path;
      if (updateMenuDto.icon !== undefined) menu.icon = updateMenuDto.icon;
      if (updateMenuDto.isVisible !== undefined)
        menu.isVisible = updateMenuDto.isVisible;
      if (updateMenuDto.isCached !== undefined)
        menu.isCached = updateMenuDto.isCached;
      if (updateMenuDto.layout !== undefined)
        menu.layout = updateMenuDto.layout;
      if (updateMenuDto.module) menu.module = updateMenuDto.module;

      // 保存菜单信息
      await manager.save(menu);

      // 重新查询菜单信息
      return manager.findOne(Menu, {
        where: { id },
        relations: ['permissions', 'parent', 'children', 'roleMenus'],
      });
    });
  }

  /**
   * 删除菜单
   */
  async removeMenu(id: number): Promise<void> {
    const menu = await this.findOneMenu(id);

    // 检查是否有子菜单
    const childrenCount = await this.menuRepository.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new BadRequestException('请先删除子菜单');
    }

    // 检查是否有关联权限
    const permissionsCount = await this.permissionRepository.count({
      where: { menuId: id },
    });

    if (permissionsCount > 0) {
      throw new BadRequestException('请先删除菜单下的权限');
    }

    // 使用事务删除菜单
    await this.transactionService.executeTransaction(async (manager) => {
      // 删除菜单
      await manager.remove(menu);
    });
  }

  /**
   * 创建权限
   */
  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    // 检查菜单是否存在
    const menu = await this.menuRepository.findOne({
      where: { id: createPermissionDto.menuId },
    });

    if (!menu) {
      throw new BadRequestException(
        `菜单ID ${createPermissionDto.menuId} 不存在`,
      );
    }

    // 检查权限key是否存在
    const existingPermission = await this.permissionRepository.findOne({
      where: { key: createPermissionDto.key },
    });
    if (existingPermission) {
      throw new BadRequestException(
        `权限Key ${createPermissionDto.key} 已存在`,
      );
    }

    // 使用事务创建权限
    return this.transactionService.executeTransaction(async (manager) => {
      // 创建权限
      const permission = manager.create(Permission, {
        menuId: createPermissionDto.menuId,
        key: createPermissionDto.key,
        name: createPermissionDto.name,
      });

      // 保存权限信息
      return await manager.save(permission);
    });
  }

  /**
   * 查询权限列表
   */
  async findAllPermissions(menuId?: number): Promise<Permission[]> {
    const where = menuId ? { menuId } : {};

    const permissions = await this.permissionRepository.find({
      where,
      relations: ['menu'],
    });

    return permissions;
  }

  /**
   * 查询单个权限
   */
  async findOnePermission(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['menu', 'rolePermissions'],
    });

    if (!permission) {
      throw new NotFoundException(`权限ID ${id} 不存在`);
    }

    return permission;
  }

  /**
   * 更新权限
   */
  async updatePermission(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOnePermission(id);

    // 如果更新菜单ID，检查菜单是否存在
    if (
      updatePermissionDto.menuId &&
      updatePermissionDto.menuId !== permission.menuId
    ) {
      const menu = await this.menuRepository.findOne({
        where: { id: updatePermissionDto.menuId },
      });

      if (!menu) {
        throw new BadRequestException(
          `菜单ID ${updatePermissionDto.menuId} 不存在`,
        );
      }
    }

    // 如果更新权限key，检查是否已存在
    if (updatePermissionDto.key && updatePermissionDto.key !== permission.key) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { key: updatePermissionDto.key },
      });
      if (existingPermission) {
        throw new BadRequestException(
          `权限Key ${updatePermissionDto.key} 已存在`,
        );
      }
    }

    // 使用事务更新权限
    return this.transactionService.executeTransaction(async (manager) => {
      // 更新权限基本信息
      if (updatePermissionDto.menuId)
        permission.menuId = updatePermissionDto.menuId;
      if (updatePermissionDto.key) permission.key = updatePermissionDto.key;
      if (updatePermissionDto.name) permission.name = updatePermissionDto.name;

      // 保存权限信息
      await manager.save(permission);

      // 重新查询权限信息
      return manager.findOne(Permission, {
        where: { id },
        relations: ['menu', 'rolePermissions'],
      });
    });
  }

  /**
   * 删除权限
   */
  async removePermission(id: number): Promise<void> {
    const permission = await this.findOnePermission(id);

    // 使用事务删除权限
    await this.transactionService.executeTransaction(async (manager) => {
      // 删除权限
      await manager.remove(permission);
    });
  }
}
