/**
 * API请求相关类型定义
 */

/**
 * 分页查询接口
 * 用于列表查询的分页参数
 * 标准分页接口的查询参数规范
 */
export interface PaginationQuery {
  /**
   * 页码
   * 从1开始的页码，默认为1
   */
  page?: number;

  /**
   * 每页数量
   * 每页显示的记录数，默认为10
   */
  pageSize?: number;

  /**
   * 排序字段
   * 用于指定排序的字段名称
   */
  sortBy?: string;

  /**
   * 排序方向
   * ASC: 升序, DESC: 降序
   */
  sortOrder?: 'ASC' | 'DESC';
}
