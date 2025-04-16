/**
 * 用户模块 DTO 类型定义
 */
import { PaginationQuery } from 'src/types/api/request.types';

/**
 * 创建用户 DTO 接口
 */
export interface ICreateUserDto {
  /**
   * 用户头像
   */
  avatar?: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 用户昵称
   */
  nickname: string;

  /**
   * 用户密码
   */
  password: string;

  /**
   * 角色ID列表
   */
  roles: number[];
}

/**
 * 更新用户 DTO 接口
 */
export interface IUpdateUserDto {
  /**
   * 用户头像
   */
  avatar?: string;

  /**
   * 用户昵称
   */
  nickname?: string;

  /**
   * 角色ID列表
   */
  roles?: number[];
}

/**
 * 查询用户 DTO 接口
 * 扩展标准分页查询接口
 */
export interface IQueryUserDto extends PaginationQuery {
  /**
   * 用户名（模糊查询）
   */
  username?: string;

  /**
   * 用户昵称（模糊查询）
   */
  nickname?: string;
}
