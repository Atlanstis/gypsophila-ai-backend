/**
 * 用户模块类型定义
 */
import { ApiResponse, PaginationQuery } from '../common/response.types';

/**
 * 用户模型
 */
export interface User {
  /**
   * 用户ID
   */
  id: string;

  /**
   * 头像URL
   */
  avatar?: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 昵称
   */
  nickname: string;

  /**
   * 是否为内置用户
   */
  isBuiltin: boolean;

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
 * 创建用户请求
 */
export interface CreateUserRequest {
  /**
   * 头像URL
   */
  avatar?: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 昵称
   */
  nickname: string;

  /**
   * 是否为内置用户
   */
  isBuiltin?: boolean;

  /**
   * 密码
   */
  password: string;
}

/**
 * 更新用户请求
 */
export interface UpdateUserRequest {
  /**
   * 头像URL
   */
  avatar?: string;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 昵称
   */
  nickname?: string;

  /**
   * 是否为内置用户
   */
  isBuiltin?: boolean;

  /**
   * 密码
   */
  password?: string;
}

/**
 * 查询用户请求
 */
export interface QueryUserRequest extends PaginationQuery {
  /**
   * 用户名（模糊查询）
   */
  username?: string;

  /**
   * 昵称（模糊查询）
   */
  nickname?: string;

  /**
   * 是否为内置用户
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
 * 查询用户详情响应
 */
export type GetUserResponse = ApiResponse<User>;

/**
 * 查询用户列表响应
 */
export type GetUserListResponse = ApiResponse<{
  total: number;
  items: User[];
}>;

/**
 * 创建用户响应
 */
export type CreateUserResponse = ApiResponse<User>;

/**
 * 更新用户响应
 */
export type UpdateUserResponse = ApiResponse<User>;

/**
 * 删除用户响应
 */
export type DeleteUserResponse = ApiResponse<null>;

/**
 * 用户接口定义
 */
export interface UserApi {
  /**
   * 创建用户
   */
  createUser(data: CreateUserRequest): Promise<CreateUserResponse>;

  /**
   * 查询用户列表
   */
  getUsers(params: QueryUserRequest): Promise<GetUserListResponse>;

  /**
   * 查询单个用户
   */
  getUser(id: string): Promise<GetUserResponse>;

  /**
   * 更新用户
   */
  updateUser(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse>;

  /**
   * 删除用户
   */
  deleteUser(id: string): Promise<DeleteUserResponse>;
}
