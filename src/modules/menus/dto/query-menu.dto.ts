import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { MenuModule, MenuType } from '../entities/menu.entity';

/**
 * 查询菜单列表DTO
 */
export class QueryMenuDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType;

  @IsOptional()
  @Type(() => Number)
  parentId?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsEnum(MenuModule)
  module?: MenuModule;
}
