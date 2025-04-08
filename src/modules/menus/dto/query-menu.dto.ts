import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common/helpers/validation-message.helper';

import { IQueryMenuDto } from '../types/dto.types';
import { MenuModule, MenuType } from '../types/entity.types';

/**
 * 查询菜单列表DTO
 */
export class QueryMenuDto implements IQueryMenuDto {
  @IsString({ message: VMH.string.isString('菜单标识') })
  @IsOptional()
  key?: string;

  @IsString({ message: VMH.string.isString('菜单名称') })
  @IsOptional()
  name?: string;

  @IsEnum(MenuType, {
    message: VMH.number.isEnum(Object.values(MenuType), '菜单类型'),
  })
  @IsOptional()
  type?: MenuType;

  @Type(() => Number)
  @IsOptional()
  parentId?: number;

  @IsBoolean({ message: VMH.boolean.isBoolean('是否可见') })
  @Type(() => Boolean)
  @IsOptional()
  isVisible?: boolean;

  @IsEnum(MenuModule, {
    message: VMH.number.isEnum(Object.values(MenuModule), '所属模块'),
  })
  @IsOptional()
  module?: MenuModule;
}
