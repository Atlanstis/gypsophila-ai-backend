/**
 * 角色模块 API 类型定义
 */
import { ApiResponse, PaginatedResponse } from 'src/types/api/response.types';

import { ICreateRoleDto, IQueryRoleDto, IUpdateRoleDto } from './dto.types';
import { IRoleEntity } from './entity.types';

/**
 * 创建角色请求
 */
export type CreateRoleRequest = ICreateRoleDto;

/**
 * 创建角色响应
 */
export type CreateRoleResponse = ApiResponse<void>;

/**
 * 查询角色列表请求
 */
export type QueryRoleListRequest = IQueryRoleDto;

/**
 * 角色列表项
 */
export type RoleListItem = Omit<
  IRoleEntity,
  'userRoles' | 'roleMenus' | 'rolePermissions'
>;

/**
 * 查询角色列表响应
 */
export type QueryRoleListResponse = ApiResponse<
  PaginatedResponse<RoleListItem>
>;

/**
 * 查询单个角色响应
 */
export type QueryRoleDetailResponse = ApiResponse<IRoleEntity>;

/**
 * 更新角色请求
 */
export type UpdateRoleRequest = IUpdateRoleDto;

/**
 * 更新角色响应
 */
export type UpdateRoleResponse = ApiResponse<void>;

/**
 * 删除角色响应
 */
export type DeleteRoleResponse = ApiResponse<void>;

/**
 * 查询非内置角色列表响应
 */
export type QueryNonBuiltinRolesResponse = ApiResponse<RoleListItem[]>;

/**
 * 角色模块 API 接口定义
 */
export interface RolesApi {
  /**
   * 创建角色
   */
  create(data: CreateRoleRequest): Promise<CreateRoleResponse>;

  /**
   * 查询角色列表
   */
  findAll(query: QueryRoleListRequest): Promise<QueryRoleListResponse>;

  /**
   * 查询单个角色
   */
  findOne(id: number): Promise<QueryRoleDetailResponse>;

  /**
   * 查询非内置角色列表
   */
  findNonBuiltinRoles(): Promise<QueryNonBuiltinRolesResponse>;

  /**
   * 更新角色
   */
  update(id: number, data: UpdateRoleRequest): Promise<UpdateRoleResponse>;

  /**
   * 删除角色
   */
  remove(id: number): Promise<DeleteRoleResponse>;
}
