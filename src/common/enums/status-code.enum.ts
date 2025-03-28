/**
 * 响应状态码枚举
 * 格式：XXXYYY
 * XXX: HTTP状态码
 * YYY: 业务码（000表示无特定业务场景）
 */
export enum StatusCode {
  /** 成功 */
  SUCCESS = 200000,

  /** 客户端错误 4xx */
  // 通用错误
  BAD_REQUEST = 400000,
  // 未授权
  UNAUTHORIZED = 401000,
  // 禁止访问
  ACCESS_FORBIDDEN = 403000,
  // 未找到
  NOT_FOUND = 404000,
  // 方法不允许
  METHOD_NOT_ALLOWED = 405000,
  // 参数错误
  PARAMETER_ERROR = 422000,
  // 请求过多
  TOO_MANY_REQUESTS = 429000,

  /** 服务端错误 5xx */
  /** 通用错误 */
  INTERNAL_SERVER_ERROR = 500000,
  // 服务不可用
  SERVICE_UNAVAILABLE = 503000,

  // 通用业务逻辑错误
  BUSINESS_ERROR = 400001,

  /** 授权认证相关错误码 */
  // 令牌过期
  TOKEN_EXPIRED = 401001,
  // 令牌无效
  TOKEN_INVALID = 401002,
  // 刷新令牌过期
  REFRESH_TOKEN_EXPIRED = 401003,
  // 刷新令牌无效
  REFRESH_TOKEN_INVALID = 401004,
  // 用户未找到
  USER_NOT_FOUND = 404005,
  // 密码错误
  PASSWORD_ERROR = 403006,
}
