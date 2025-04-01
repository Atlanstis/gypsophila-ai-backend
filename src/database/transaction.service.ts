import { DataSource, EntityManager } from 'typeorm';

import { Injectable } from '@nestjs/common';

/**
 * 事务管理服务
 * 提供执行事务的通用方法
 */
@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * 在事务中执行操作
   * @param callback 事务回调函数
   * @returns 事务执行结果
   */
  async executeTransaction<T>(
    callback: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
