/**
 * 通用响应接口
 * 定义API响应的标准格式
 */
export interface IResponse<T = any> {
  /**
   * 响应状态码
   * 格式：XXXYYY，其中：
   * XXX: HTTP状态码（如200、401、404、500等）
   * YYY: 业务码（000表示无特定业务场景）
   */
  code: number;

  /**
   * 响应消息
   */
  message: string;

  /**
   * 响应数据
   * 正常情况下包含返回的业务数据
   * 错误情况下为null
   */
  data: T | null;

  /**
   * 请求路径
   */
  path: string;

  /**
   * 请求时间戳
   */
  timestamp: number;

  /**
   * 错误详情（仅在开发环境下返回）
   */
  error?: string;
}
