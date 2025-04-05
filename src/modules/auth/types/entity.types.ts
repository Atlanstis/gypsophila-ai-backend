/**
 * 认证模块实体类型定义
 */

/**
 * 用户实体接口
 * 用于描述从数据库中获取的用户信息
 */
export interface IUserEntity {
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
  createdAt: Date;

  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * 用户认证方式枚举
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
   * 用户实体
   */
  user?: IUserEntity;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 更新时间
   */
  updatedAt: Date;
}
