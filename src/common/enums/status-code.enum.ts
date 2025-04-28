/**
 * 响应状态码枚举
 * 格式：XXXYYY
 * XXX: HTTP状态码
 * YYY: 业务码（000表示无特定业务场景）
 */
export enum StatusCode {
  /** 接口执行成功 */
  SUCCESS = 200000,
  /** 业务执行失败 */
  BUSINESS_FAILED = 200001,

  /** 客户端错误 4xx */
  BAD_REQUEST = 400000,
  /** 参数错误 */
  PARAMETER_ERROR = 400001,

  /** 授权认证相关错误码 */
  /** 未授权-需要重新登录 */
  UNAUTHORIZED = 401000,
  /** 访问令牌过期-可以通过刷新令牌重新获取 */
  ACCESS_TOKEN_EXPIRED = 401001,
  /** 访问令牌无效-需要重新登录 */
  ACCESS_TOKEN_INVALID = 401002,
  /** 刷新令牌过期-需要重新登录 */
  REFRESH_TOKEN_EXPIRED = 401003,
  /** 刷新令牌无效-需要重新登录 */
  REFRESH_TOKEN_INVALID = 401004,

  /** 找不到资源 */
  NOT_FOUND = 404000,

  /** 服务端错误 5xx */
  /** 通用错误 */
  INTERNAL_SERVER_ERROR = 500000,
  /** 配置错误 */
  CONFIG_ERROR = 500001,
}
