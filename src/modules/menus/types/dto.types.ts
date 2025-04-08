/**
 * 菜单模块DTO类型定义
 */
import { PaginationQuery } from 'src/types/api/request.types';

import { MenuModule, MenuType } from './entity.types';

/**
 * 创建菜单DTO接口
 */
export interface ICreateMenuDto {
  /**
   * 菜单唯一键
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
   * 父级菜单ID
   */
  parentId?: number;

  /**
   * 排序号
   */
  orderNum?: number;

  /**
   * 菜单路径
   */
  path: string;

  /**
   * 菜单图标
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
   * 菜单布局
   */
  layout?: string;

  /**
   * 所属模块
   */
  module?: MenuModule;
}

/**
 * 更新菜单DTO接口
 */
export interface IUpdateMenuDto {
  /**
   * 菜单唯一键
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
   * 父级菜单ID
   */
  parentId?: number;

  /**
   * 排序号
   */
  orderNum?: number;

  /**
   * 菜单路径
   */
  path?: string;

  /**
   * 菜单图标
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
   * 菜单布局
   */
  layout?: string;

  /**
   * 所属模块
   */
  module?: MenuModule;
}

/**
 * 查询菜单DTO接口
 */
export interface IQueryMenuDto {
  /**
   * 菜单唯一键
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
   * 父级菜单ID
   */
  parentId?: number;

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
 * 创建权限DTO接口
 */
export interface ICreatePermissionDto {
  /**
   * 菜单ID
   */
  menuId: number;

  /**
   * 权限唯一键
   */
  key: string;

  /**
   * 权限名称
   */
  name: string;
}

/**
 * 更新权限DTO接口
 */
export interface IUpdatePermissionDto {
  /**
   * 菜单ID
   */
  menuId?: number;

  /**
   * 权限唯一键
   */
  key?: string;

  /**
   * 权限名称
   */
  name?: string;
}
