/**
 * 用户模块 API 类型定义
 */
import { ApiResponse, PaginatedResponse } from 'src/types/api/response.types';

import { ICreateUserDto, IQueryUserDto, IUpdateUserDto } from './dto.types';
import { IUserEntity } from './entity.types';

/**
 * 创建用户请求
 */
export type CreateUserRequest = ICreateUserDto;

/**
 * 创建用户响应
 */
export type CreateUserResponse = ApiResponse<void>;

/**
 * 查询用户列表请求
 */
export type QueryUserListRequest = IQueryUserDto;

/**
 * 用户列表项
 */
export type UserListItem = Omit<IUserEntity, 'auths' | 'userRoles'>;

/**
 * 查询用户列表响应
 */
export type QueryUserListResponse = ApiResponse<
  PaginatedResponse<UserListItem>
>;

/**
 * 查询单个用户响应
 */
export type QueryUserDetailResponse = ApiResponse<IUserEntity>;

/**
 * 更新用户请求
 */
export type UpdateUserRequest = IUpdateUserDto;

/**
 * 更新用户响应
 */
export type UpdateUserResponse = ApiResponse<void>;

/**
 * 删除用户响应
 */
export type DeleteUserResponse = ApiResponse<void>;

/**
 * 用户模块 API 接口定义
 */
export interface UsersApi {
  /**
   * 创建用户
   */
  create(data: CreateUserRequest): Promise<CreateUserResponse>;

  /**
   * 查询用户列表
   */
  findAll(query: QueryUserListRequest): Promise<QueryUserListResponse>;

  /**
   * 查询单个用户
   */
  findOne(id: string): Promise<QueryUserDetailResponse>;

  /**
   * 更新用户
   */
  update(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse>;

  /**
   * 删除用户
   */
  remove(id: string): Promise<DeleteUserResponse>;
}
