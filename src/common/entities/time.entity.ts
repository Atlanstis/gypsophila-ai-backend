import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 时间实体基类
 * 提供标准的创建时间和更新时间字段
 * 配置为东八区时间格式
 * 使用datetime类型避免timestamp的2038年问题
 */
export abstract class TimeEntity {
  /**
   * 创建时间（东八区时间）
   * 使用datetime类型避免timestamp的2038年问题
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  /**
   * 更新时间（东八区时间）
   * 使用datetime类型避免timestamp的2038年问题
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;
}
