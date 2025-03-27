import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { MenuModule, MenuType } from '../entities/menu.entity';

/**
 * 创建菜单DTO
 */
export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  key: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @IsNotEmpty()
  @IsEnum(MenuType)
  type: MenuType;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsNumber()
  orderNum?: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  path: string;

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
