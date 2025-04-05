/**
 * API请求相关类型定义
 */

/**
 * 分页查询接口
 * 用于列表查询的分页参数
 */
export interface PaginationQuery {
  /**
   * 页码
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;

  /**
   * 排序字段
   */
  sortBy?: string;

  /**
   * 排序方向
   */
  sortOrder?: 'ASC' | 'DESC';
}
