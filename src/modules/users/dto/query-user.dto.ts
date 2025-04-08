import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common/helpers/validation-message.helper';

import { IQueryUserDto } from '../types/dto.types';

/**
 * 查询用户列表DTO
 */
export class QueryUserDto implements IQueryUserDto {
  /**
   * 用户名
   * 模糊查询用户名
   */
  @IsString({ message: VMH.string.isString('用户名') })
  @IsOptional()
  username?: string;

  /**
   * 用户昵称
   * 模糊查询用户昵称
   */
  @IsString({ message: VMH.string.isString('用户昵称') })
  @IsOptional()
  nickname?: string;

  /**
   * 标准页码
   * 从1开始的页码，默认为1
   */
  @IsNumber({}, { message: VMH.number.isNumber('页码') })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  /**
   * 每页数量
   * 每页显示的记录数，默认为10
   */
  @IsNumber({}, { message: VMH.number.isNumber('每页数量') })
  @Type(() => Number)
  @IsOptional()
  pageSize?: number = 10;

  /**
   * 排序字段
   * 用于指定排序的字段名称
   */
  @IsString({ message: VMH.string.isString('排序字段') })
  @IsOptional()
  sortBy?: string;

  /**
   * 排序方向
   * ASC: 升序, DESC: 降序
   */
  @IsEnum(['ASC', 'DESC'], {
    message: VMH.number.isEnum(['ASC', 'DESC'], '排序方向'),
  })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
