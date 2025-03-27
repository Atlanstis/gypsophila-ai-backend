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
import {
  MENU_ICON_MAX_LENGTH,
  MENU_KEY_MAX_LENGTH,
  MENU_KEY_MIN_LENGTH,
  MENU_LAYOUT_MAX_LENGTH,
  MENU_NAME_MAX_LENGTH,
  MENU_NAME_MIN_LENGTH,
  MENU_PATH_MAX_LENGTH,
  MENU_PATH_MIN_LENGTH,
} from '../constants';

/**
 * 创建菜单DTO
 */
export class CreateMenuDto {
  @IsString()
  @Length(MENU_KEY_MIN_LENGTH, MENU_KEY_MAX_LENGTH)
  @IsNotEmpty()
  key: string;

  @IsString()
  @Length(MENU_NAME_MIN_LENGTH, MENU_NAME_MAX_LENGTH)
  @IsNotEmpty()
  name: string;

  @IsEnum(MenuType)
  @IsNotEmpty()
  type: MenuType;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsNumber()
  @IsOptional()
  orderNum?: number;

  @IsString()
  @Length(MENU_PATH_MIN_LENGTH, MENU_PATH_MAX_LENGTH)
  @IsNotEmpty()
  path: string;

  @IsString()
  @Length(0, MENU_ICON_MAX_LENGTH)
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsBoolean()
  @IsOptional()
  isCached?: boolean;

  @IsString()
  @Length(0, MENU_LAYOUT_MAX_LENGTH)
  @IsOptional()
  layout?: string;

  @IsEnum(MenuModule)
  @IsOptional()
  module?: MenuModule;
}
