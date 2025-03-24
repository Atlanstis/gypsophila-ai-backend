/**
 * JWT配置常量
 */
export const JWT_CONSTANTS = {
  // JWT密钥，实际使用时应从环境变量获取
  SECRET: process.env.JWT_SECRET || 'secretKey',

  // 访问令牌过期时间
  ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',

  // 刷新令牌过期时间
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
