/**
 * 菜单模块类型定义
 */
import { ApiResponse } from '../common/response.types';

/**
 * 菜单类型枚举
 */
export enum MenuType {
  DIRECTORY = 'directory',
  PAGE = 'page',
}

/**
 * 菜单所属模块枚举
 */
export enum MenuModule {
  ADMIN = 'admin',
}

/**
 * 菜单模型
 */
export interface Menu {
  /**
   * 菜单ID
   */
  id: number;

  /**
   * 菜单唯一标识
   */
  key: string;

  /**
   * 菜单名称
   */
  name: string;

  /**
   * 菜单类型
   */
  type: MenuType;

  /**
   * 父菜单ID
   */
  parentId?: number;

  /**
   * 排序序号
   */
  orderNum: number;

  /**
   * 路径
   */
  path: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 是否可见
   */
  isVisible: boolean;

  /**
   * 是否缓存
   */
  isCached: boolean;

  /**
   * 布局类型
   */
  layout?: string;

  /**
   * 所属模块
   */
  module: MenuModule;

  /**
   * 子菜单
   */
  children?: Menu[];

  /**
   * 权限列表
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
 * 权限模型
 */
export interface Permission {
  /**
   * 权限ID
   */
  id: number;

  /**
   * 菜单ID
   */
  menuId: number;

  /**
   * 权限唯一标识
   */
  key: string;

  /**
   * 权限名称
   */
  name: string;

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
 * 创建菜单请求
 */
export interface CreateMenuRequest {
  /**
   * 菜单唯一标识
   */
  key: string;

  /**
   * 菜单名称
   */
  name: string;

  /**
   * 菜单类型
   */
  type: MenuType;

  /**
   * 父菜单ID
   */
  parentId?: number;

  /**
   * 排序序号
   */
  orderNum?: number;

  /**
   * 路径
   */
  path: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 是否可见
   */
  isVisible?: boolean;

  /**
   * 是否缓存
   */
  isCached?: boolean;

  /**
   * 布局类型
   */
  layout?: string;

  /**
   * 所属模块
   */
  module?: MenuModule;
}

/**
 * 更新菜单请求
 */
export interface UpdateMenuRequest {
  /**
   * 菜单唯一标识
   */
  key?: string;

  /**
   * 菜单名称
   */
  name?: string;

  /**
   * 菜单类型
   */
  type?: MenuType;

  /**
   * 父菜单ID
   */
  parentId?: number;

  /**
   * 排序序号
   */
  orderNum?: number;

  /**
   * 路径
   */
  path?: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 是否可见
   */
  isVisible?: boolean;

  /**
   * 是否缓存
   */
  isCached?: boolean;

  /**
   * 布局类型
   */
  layout?: string;

  /**
   * 所属模块
   */
  module?: MenuModule;
}

/**
 * 查询菜单请求
 */
export interface QueryMenuRequest {
  /**
   * 菜单名称（模糊查询）
   */
  name?: string;

  /**
   * 是否可见
   */
  isVisible?: boolean;

  /**
   * 所属模块
   */
  module?: MenuModule;
}

/**
 * 创建权限请求
 */
export interface CreatePermissionRequest {
  /**
   * 菜单ID
   */
  menuId: number;

  /**
   * 权限唯一标识
   */
  key: string;

  /**
   * 权限名称
   */
  name: string;
}

/**
 * 更新权限请求
 */
export interface UpdatePermissionRequest {
  /**
   * 权限唯一标识
   */
  key?: string;

  /**
   * 权限名称
   */
  name?: string;
}

/**
 * 创建菜单响应
 */
export type CreateMenuResponse = ApiResponse<Menu>;

/**
 * 查询菜单列表响应
 */
export type GetMenuListResponse = ApiResponse<Menu[]>;

/**
 * 查询菜单详情响应
 */
export type GetMenuResponse = ApiResponse<Menu>;

/**
 * 更新菜单响应
 */
export type UpdateMenuResponse = ApiResponse<Menu>;

/**
 * 删除菜单响应
 */
export type DeleteMenuResponse = ApiResponse<null>;

/**
 * 创建权限响应
 */
export type CreatePermissionResponse = ApiResponse<Permission>;

/**
 * 查询权限列表响应
 */
export type GetPermissionListResponse = ApiResponse<Permission[]>;

/**
 * 查询权限详情响应
 */
export type GetPermissionResponse = ApiResponse<Permission>;

/**
 * 更新权限响应
 */
export type UpdatePermissionResponse = ApiResponse<Permission>;

/**
 * 删除权限响应
 */
export type DeletePermissionResponse = ApiResponse<null>;

/**
 * 菜单接口定义
 */
export interface MenuApi {
  /**
   * 创建菜单
   */
  createMenu(data: CreateMenuRequest): Promise<CreateMenuResponse>;

  /**
   * 查询菜单列表
   */
  getMenus(params: QueryMenuRequest): Promise<GetMenuListResponse>;

  /**
   * 查询单个菜单
   */
  getMenu(id: number): Promise<GetMenuResponse>;

  /**
   * 更新菜单
   */
  updateMenu(id: number, data: UpdateMenuRequest): Promise<UpdateMenuResponse>;

  /**
   * 删除菜单
   */
  deleteMenu(id: number): Promise<DeleteMenuResponse>;

  /**
   * 创建权限
   */
  createPermission(
    data: CreatePermissionRequest,
  ): Promise<CreatePermissionResponse>;

  /**
   * 查询权限列表
   */
  getPermissions(menuId?: number): Promise<GetPermissionListResponse>;

  /**
   * 查询单个权限
   */
  getPermission(id: number): Promise<GetPermissionResponse>;

  /**
   * 更新权限
   */
  updatePermission(
    id: number,
    data: UpdatePermissionRequest,
  ): Promise<UpdatePermissionResponse>;

  /**
   * 删除权限
   */
  deletePermission(id: number): Promise<DeletePermissionResponse>;
}
