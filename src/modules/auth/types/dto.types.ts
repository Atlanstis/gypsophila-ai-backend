/**
 * 认证模块DTO类型定义
 */

/**
 * 登录DTO接口
 */
export interface ILoginDto {
  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;
}

/**
 * 刷新令牌DTO接口
 */
export interface IRefreshTokenDto {
  /**
   * 刷新令牌
   */
  refreshToken: string;
}
