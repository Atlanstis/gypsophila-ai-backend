/**
 * 角色模块类型定义
 */
import { ApiResponse } from '../common/response.types';
import { Menu, Permission } from '../menus/menus.types';

/**
 * 角色模型
 */
export interface Role {
  /**
   * 角色ID
   */
  id: number;

  /**
   * 角色名称
   */
  name: string;

  /**
   * 角色描述
   */
  description?: string;

  /**
   * 是否为内置角色
   */
  isBuiltin: boolean;

  /**
   * 角色关联的菜单列表
   */
  menus?: Menu[];

  /**
   * 角色关联的权限列表
   */
  permissions?: Permission[];

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 更新时间
   */
  updatedAt: string;
}

/**
 * 创建角色请求
 */
export interface CreateRoleRequest {
  /**
   * 角色名称
   */
  name: string;

  /**
   * 角色描述
   */
  description?: string;

  /**
   * 是否为内置角色
   */
  isBuiltin?: boolean;

  /**
   * 角色关联的菜单ID列表
   */
  menuIds?: number[];

  /**
   * 角色关联的权限ID列表
   */
  permissionIds?: number[];
}

/**
 * 更新角色请求
 */
export interface UpdateRoleRequest {
  /**
   * 角色名称
   */
  name?: string;

  /**
   * 角色描述
   */
  description?: string;

  /**
   * 是否为内置角色
   */
  isBuiltin?: boolean;

  /**
   * 角色关联的菜单ID列表
   */
  menuIds?: number[];

  /**
   * 角色关联的权限ID列表
   */
  permissionIds?: number[];
}

/**
 * 查询角色请求
 */
export interface QueryRoleRequest {
  /**
   * 角色名称（模糊查询）
   */
  name?: string;

  /**
   * 是否为内置角色
   */
  isBuiltin?: boolean;

  /**
   * 每页数量
   */
  pageSize?: number;

  /**
   * 当前页码
   */
  current?: number;
}

/**
 * 创建角色响应
 */
export type CreateRoleResponse = ApiResponse<Role>;

/**
 * 查询角色列表响应
 */
export type GetRoleListResponse = ApiResponse<{
  total: number;
  items: Role[];
}>;

/**
 * 查询角色详情响应
 */
export type GetRoleResponse = ApiResponse<Role>;

/**
 * 更新角色响应
 */
export type UpdateRoleResponse = ApiResponse<Role>;

/**
 * 删除角色响应
 */
export type DeleteRoleResponse = ApiResponse<null>;

/**
 * 角色接口定义
 */
export interface RoleApi {
  /**
   * 创建角色
   */
  createRole(data: CreateRoleRequest): Promise<CreateRoleResponse>;

  /**
   * 查询角色列表
   */
  getRoles(params: QueryRoleRequest): Promise<GetRoleListResponse>;

  /**
   * 查询单个角色
   */
  getRole(id: number): Promise<GetRoleResponse>;

  /**
   * 更新角色
   */
  updateRole(id: number, data: UpdateRoleRequest): Promise<UpdateRoleResponse>;

  /**
   * 删除角色
   */
  deleteRole(id: number): Promise<DeleteRoleResponse>;
}
