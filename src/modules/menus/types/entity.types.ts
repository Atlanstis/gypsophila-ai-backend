/**
 * 菜单模块实体类型定义
 */
import { TimeEntity } from 'src/common';
import { IRoleEntity, IRolePermissionEntity } from 'src/modules/roles/types';

/**
 * 菜单类型
 */
export enum MenuType {
  DIRECTORY = 'directory',
  PAGE = 'page',
}

/**
 * 菜单所属模块
 */
export enum MenuModule {
  ADMIN = 'admin',
}

/**
 * 菜单实体接口
 */
export interface IMenuEntity extends TimeEntity {
  /**
   * 主键ID
   */
  id: number;

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
  parentId: number;

  /**
   * 排序号
   */
  orderNum: number;

  /**
   * 菜单路径
   */
  path: string;

  /**
   * 菜单图标
   */
  icon: string;

  /**
   * 是否可见
   */
  isVisible: boolean;

  /**
   * 是否缓存
   */
  isCached: boolean;

  /**
   * 菜单布局
   */
  layout: string;

  /**
   * 所属模块
   */
  module: MenuModule;

  /**
   * 父级菜单
   */
  parent?: IMenuEntity;

  /**
   * 子菜单
   */
  children?: IMenuEntity[];

  /**
   * 菜单权限
   */
  permissions?: IPermissionEntity[];

  /**
   * 角色菜单关联
   */
  roleMenus?: IRoleMenuEntity[];
}

/**
 * 权限实体接口
 */
export interface IPermissionEntity extends TimeEntity {
  /**
   * 主键ID
   */
  id: number;

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

  /**
   * 所属菜单
   */
  menu?: IMenuEntity;

  /**
   * 角色权限关联
   */
  rolePermissions?: IRolePermissionEntity[];
}

/**
 * 角色菜单关联实体接口
 */
export interface IRoleMenuEntity extends TimeEntity {
  /**
   * 主键ID
   */
  id: number;

  /**
   * 角色ID
   */
  roleId: number;

  /**
   * 菜单ID
   */
  menuId: number;

  /**
   * 角色
   */
  role?: IRoleEntity;

  /**
   * 菜单
   */
  menu?: IMenuEntity;
}
