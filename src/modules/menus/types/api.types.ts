/**
 * 菜单模块API类型定义
 */
import { ApiResponse, PaginatedResponse } from 'src/types/api/response.types';

import { MenuTreeNode } from './business.types';
import {
  ICreateMenuDto,
  ICreatePermissionDto,
  IQueryMenuDto,
  IUpdateMenuDto,
  IUpdatePermissionDto,
} from './dto.types';
import { IMenuEntity, IPermissionEntity } from './entity.types';

// 菜单API请求和响应类型

/**
 * 创建菜单请求
 */
export type CreateMenuRequest = ICreateMenuDto;

/**
 * 创建菜单响应
 */
export type CreateMenuResponse = ApiResponse<void>;

/**
 * 查询菜单列表请求
 */
export type QueryMenuListRequest = IQueryMenuDto;

/**
 * 查询菜单列表响应
 */
export type QueryMenuListResponse = ApiResponse<MenuTreeNode[]>;

/**
 * 查询单个菜单请求
 */
export interface GetMenuRequest {
  id: number;
}

/**
 * 查询单个菜单响应
 */
export type GetMenuResponse = ApiResponse<IMenuEntity>;

/**
 * 更新菜单请求
 */
export interface UpdateMenuRequest {
  id: number;
  data: IUpdateMenuDto;
}

/**
 * 更新菜单响应
 */
export type UpdateMenuResponse = ApiResponse<void>;

/**
 * 删除菜单请求
 */
export interface DeleteMenuRequest {
  id: number;
}

/**
 * 删除菜单响应
 */
export type DeleteMenuResponse = ApiResponse<void>;

// 权限API请求和响应类型

/**
 * 创建权限请求
 */
export type CreatePermissionRequest = ICreatePermissionDto;

/**
 * 创建权限响应
 */
export type CreatePermissionResponse = ApiResponse<void>;

/**
 * 查询权限列表请求
 */
export interface QueryPermissionListRequest {
  menuId?: number;
}

/**
 * 查询权限列表响应
 */
export type QueryPermissionListResponse = ApiResponse<IPermissionEntity[]>;

/**
 * 查询单个权限请求
 */
export interface GetPermissionRequest {
  id: number;
}

/**
 * 查询单个权限响应
 */
export type GetPermissionResponse = ApiResponse<IPermissionEntity>;

/**
 * 更新权限请求
 */
export interface UpdatePermissionRequest {
  id: number;
  data: IUpdatePermissionDto;
}

/**
 * 更新权限响应
 */
export type UpdatePermissionResponse = ApiResponse<void>;

/**
 * 删除权限请求
 */
export interface DeletePermissionRequest {
  id: number;
}

/**
 * 删除权限响应
 */
export type DeletePermissionResponse = ApiResponse<void>;

/**
 * 菜单API接口定义
 */
export interface MenusApi {
  /**
   * 创建菜单
   */
  createMenu(data: CreateMenuRequest): Promise<CreateMenuResponse>;

  /**
   * 查询菜单列表
   */
  findAllMenus(query: QueryMenuListRequest): Promise<QueryMenuListResponse>;

  /**
   * 查询单个菜单
   */
  findOneMenu(id: string): Promise<GetMenuResponse>;

  /**
   * 更新菜单
   */
  updateMenu(id: string, data: IUpdateMenuDto): Promise<UpdateMenuResponse>;

  /**
   * 删除菜单
   */
  removeMenu(id: string): Promise<DeleteMenuResponse>;

  /**
   * 创建权限
   */
  createPermission(
    data: CreatePermissionRequest,
  ): Promise<CreatePermissionResponse>;

  /**
   * 查询权限列表
   */
  findAllPermissions(menuId?: string): Promise<QueryPermissionListResponse>;

  /**
   * 查询单个权限
   */
  findOnePermission(id: string): Promise<GetPermissionResponse>;

  /**
   * 更新权限
   */
  updatePermission(
    id: string,
    data: IUpdatePermissionDto,
  ): Promise<UpdatePermissionResponse>;

  /**
   * 删除权限
   */
  removePermission(id: string): Promise<DeletePermissionResponse>;
}
