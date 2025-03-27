import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { MenuModule, MenuType } from '../entities/menu.entity';

/**
 * 更新菜单DTO
 */
export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  key?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsNumber()
  orderNum?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  path?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsBoolean()
  isCached?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  layout?: string;

  @IsOptional()
  @IsEnum(MenuModule)
  module?: MenuModule;
}
