import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common';

import { IQueryRoleDto } from '../types/dto.types';

/**
 * 查询角色列表DTO
 */
export class QueryRoleDto implements IQueryRoleDto {
  /**
   * 角色名称（模糊查询）
   */
  @IsString({ message: VMH.string.isString('角色名称') })
  @IsOptional()
  name?: string;

  /**
   * 是否内置角色
   */
  @IsBoolean({ message: VMH.boolean.isBoolean('是否内置角色') })
  @Type(() => Boolean)
  @IsOptional()
  isBuiltin?: boolean;

  /**
   * 页码
   * 从1开始
   */
  @IsNumber({}, { message: VMH.number.isNumber('页码') })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  /**
   * 每页数量
   */
  @IsNumber({}, { message: VMH.number.isNumber('每页数量') })
  @Type(() => Number)
  @IsOptional()
  pageSize?: number = 10;

  /**
   * 排序字段
   */
  @IsString({ message: VMH.string.isString('排序字段') })
  @IsOptional()
  sortBy?: string;

  /**
   * 排序方向
   */
  @IsString({ message: VMH.string.isString('排序方向') })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
