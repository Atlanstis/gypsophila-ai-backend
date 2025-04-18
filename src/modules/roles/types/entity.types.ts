/**
 * 角色模块实体类型定义
 */
import { IPermissionEntity, IRoleMenuEntity } from 'src/modules/menus/types';
import { IUserRoleEntity } from 'src/modules/users/types';

/**
 * 角色实体接口
 */
export interface IRoleEntity {
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
  description: string;

  /**
   * 是否为内置角色
   */
  isBuiltin: boolean;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 更新时间
   */
  updatedAt: Date;

  /**
   * 角色关联的用户
   */
  userRoles?: IUserRoleEntity[];

  /**
   * 角色关联的菜单
   */
  roleMenus?: IRoleMenuEntity[];

  /**
   * 角色关联的权限
   */
  rolePermissions?: IRolePermissionEntity[];
}

/**
 * 角色权限关联实体接口
 */
export interface IRolePermissionEntity {
  /**
   * 角色权限关联ID
   */
  id: number;

  /**
   * 角色ID
   */
  roleId: number;

  /**
   * 权限ID
   */
  permissionId: number;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 更新时间
   */
  updatedAt: Date;

  /**
   * 关联的角色
   */
  role?: IRoleEntity;

  /**
   * 关联的权限
   */
  permission?: IPermissionEntity;
}
