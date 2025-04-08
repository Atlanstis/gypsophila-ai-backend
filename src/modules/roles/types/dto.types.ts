/**
 * 角色模块 DTO 类型定义
 */
import { PaginationQuery } from 'src/types/api/request.types';

/**
 * 创建角色 DTO 接口
 */
export interface ICreateRoleDto {
  /**
   * 角色名称
   */
  name: string;

  /**
   * 角色描述
   */
  description?: string;
}

/**
 * 更新角色 DTO 接口
 */
export interface IUpdateRoleDto {
  /**
   * 角色名称
   */
  name?: string;

  /**
   * 角色描述
   */
  description?: string;
}

/**
 * 查询角色 DTO 接口
 * 扩展标准分页查询接口
 */
export interface IQueryRoleDto extends PaginationQuery {
  /**
   * 角色名称（模糊查询）
   */
  name?: string;

  /**
   * 是否内置角色
   */
  isBuiltin?: boolean;
}
