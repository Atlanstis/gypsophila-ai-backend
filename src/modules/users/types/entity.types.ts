/**
 * 用户模块实体类型定义
 */
import { IRoleEntity } from 'src/modules/roles/types';

/**
 * 用户实体接口
 */
export interface IUserEntity {
  /**
   * 用户ID
   */
  id: string;

  /**
   * 用户头像
   */
  avatar: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 用户昵称
   */
  nickname: string;

  /**
   * 是否为内置用户
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
   * 用户认证信息
   */
  auths?: IUserAuthEntity[];

  /**
   * 用户角色关联
   */
  userRoles?: IUserRoleEntity[];
}

/**
 * 用户认证方式
 */
export enum AuthType {
  PASSWORD = 'password',
}

/**
 * 用户认证实体接口
 */
export interface IUserAuthEntity {
  /**
   * 认证ID
   */
  id: number;

  /**
   * 用户ID
   */
  userId: string;

  /**
   * 认证类型
   */
  authType: AuthType;

  /**
   * 认证数据
   */
  authData: string;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 更新时间
   */
  updatedAt: Date;

  /**
   * 关联的用户
   */
  user?: IUserEntity;
}

/**
 * 用户角色关联实体接口
 */
export interface IUserRoleEntity {
  /**
   * 用户角色关联ID
   */
  id: number;

  /**
   * 用户ID
   */
  userId: string;

  /**
   * 角色ID
   */
  roleId: number;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 关联的用户
   */
  user?: IUserEntity;

  /**
   * 关联的角色
   */
  role?: IRoleEntity;
}
