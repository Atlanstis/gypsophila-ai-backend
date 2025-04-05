/**
 * 令牌对类型
 */
export interface TokenPair {
  /**
   * 访问令牌
   */
  accessToken: string;

  /**
   * 刷新令牌
   */
  refreshToken: string;
}

/**
 * JWT载荷接口
 */
export interface JwtPayload {
  /**
   * 用户ID
   */
  sub: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 令牌类型
   */
  type: 'access' | 'refresh';
}
