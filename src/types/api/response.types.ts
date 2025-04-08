/**
 * API响应相关类型定义
 */

/**
 * 通用响应接口
 * 定义API响应的标准格式
 */
export interface ApiResponse<T = any> {
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

/**
 * 分页响应接口
 * 标准分页接口的响应数据结构
 */
export interface PaginatedResponse<T> {
  /**
   * 数据项列表
   * 当前页的数据记录
   */
  items: T[];

  /**
   * 总数据量
   * 符合查询条件的总记录数
   */
  total: number;

  /**
   * 页码
   * 当前页码，从1开始
   */
  page: number;

  /**
   * 每页数量
   * 每页显示的记录数
   */
  pageSize: number;
}
