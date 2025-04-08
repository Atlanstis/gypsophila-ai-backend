import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResponseMessage } from 'src/common';

import {
  CreateMenuDto,
  CreatePermissionDto,
  QueryMenuDto,
  UpdateMenuDto,
  UpdatePermissionDto,
} from './dto';
import { MenusService } from './menus.service';
import {
  CreateMenuResponse,
  CreatePermissionResponse,
  DeleteMenuResponse,
  DeletePermissionResponse,
  GetMenuResponse,
  GetPermissionResponse,
  QueryMenuListResponse,
  QueryPermissionListResponse,
  UpdateMenuResponse,
  UpdatePermissionResponse,
} from './types/api.types';

/**
 * 菜单控制器
 */
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  /**
   * 创建菜单
   */
  @Post()
  @ResponseMessage('创建菜单成功')
  async createMenu(
    @Body() data: CreateMenuDto,
  ): Promise<CreateMenuResponse['data']> {
    return await this.menusService.createMenu(data);
  }

  /**
   * 查询菜单列表
   */
  @Get()
  @ResponseMessage('查询菜单列表成功')
  async findAllMenus(
    @Query() query: QueryMenuDto,
  ): Promise<QueryMenuListResponse['data']> {
    return this.menusService.findAllMenus(query);
  }

  /**
   * 查询单个菜单
   */
  @Get(':id')
  @ResponseMessage('查询菜单成功')
  async findOneMenu(@Param('id') id: string): Promise<GetMenuResponse['data']> {
    return this.menusService.findOneMenu(+id);
  }

  /**
   * 更新菜单
   */
  @Patch(':id')
  @ResponseMessage('更新菜单成功')
  async updateMenu(
    @Param('id') id: string,
    @Body() data: UpdateMenuDto,
  ): Promise<UpdateMenuResponse['data']> {
    return await this.menusService.updateMenu(+id, data);
  }

  /**
   * 删除菜单
   */
  @Delete(':id')
  @ResponseMessage('删除菜单成功')
  async removeMenu(
    @Param('id') id: string,
  ): Promise<DeleteMenuResponse['data']> {
    return await this.menusService.removeMenu(+id);
  }

  /**
   * 创建权限
   */
  @Post('permissions')
  @ResponseMessage('创建权限成功')
  async createPermission(
    @Body() data: CreatePermissionDto,
  ): Promise<CreatePermissionResponse['data']> {
    return await this.menusService.createPermission(data);
  }

  /**
   * 查询权限列表
   */
  @Get('permissions')
  @ResponseMessage('查询权限列表成功')
  async findAllPermissions(
    @Query('menuId') menuId?: string,
  ): Promise<QueryPermissionListResponse['data']> {
    const menuIdNum = menuId ? +menuId : undefined;
    return this.menusService.findAllPermissions(menuIdNum);
  }

  /**
   * 查询单个权限
   */
  @Get('permissions/:id')
  @ResponseMessage('查询权限成功')
  async findOnePermission(
    @Param('id') id: string,
  ): Promise<GetPermissionResponse['data']> {
    return this.menusService.findOnePermission(+id);
  }

  /**
   * 更新权限
   */
  @Patch('permissions/:id')
  @ResponseMessage('更新权限成功')
  async updatePermission(
    @Param('id') id: string,
    @Body() data: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse['data']> {
    return await this.menusService.updatePermission(+id, data);
  }

  /**
   * 删除权限
   */
  @Delete('permissions/:id')
  @ResponseMessage('删除权限成功')
  async removePermission(
    @Param('id') id: string,
  ): Promise<DeletePermissionResponse['data']> {
    return await this.menusService.removePermission(+id);
  }
}
