import {
  IsBoolean,
  IsEnum,
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
 * 更新菜单DTO
 */
export class UpdateMenuDto {
  @IsString()
  @Length(MENU_KEY_MIN_LENGTH, MENU_KEY_MAX_LENGTH)
  @IsOptional()
  key?: string;

  @IsString()
  @Length(MENU_NAME_MIN_LENGTH, MENU_NAME_MAX_LENGTH)
  @IsOptional()
  name?: string;

  @IsEnum(MenuType)
  @IsOptional()
  type?: MenuType;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsNumber()
  @IsOptional()
  orderNum?: number;

  @IsString()
  @Length(MENU_PATH_MIN_LENGTH, MENU_PATH_MAX_LENGTH)
  @IsOptional()
  path?: string;

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
