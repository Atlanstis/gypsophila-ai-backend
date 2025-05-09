import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common';

import {
  MENU_ICON_MAX_LENGTH,
  MENU_KEY_MAX_LENGTH,
  MENU_KEY_MIN_LENGTH,
  MENU_LAYOUT_MAX_LENGTH,
  MENU_NAME_MAX_LENGTH,
  MENU_NAME_MIN_LENGTH,
  MENU_PATH_MAX_LENGTH,
  MENU_PATH_MIN_LENGTH,
} from '../menus.constants';
import { ICreateMenuDto, MenuModule, MenuType } from '../types';

/**
 * 创建菜单DTO
 */
export class CreateMenuDto implements ICreateMenuDto {
  @Length(MENU_KEY_MIN_LENGTH, MENU_KEY_MAX_LENGTH, {
    message: VMH.string.length(
      MENU_KEY_MIN_LENGTH,
      MENU_KEY_MAX_LENGTH,
      '菜单标识',
    ),
  })
  @IsString({ message: VMH.string.isString('菜单标识') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('菜单标识') })
  key: string;

  @Length(MENU_NAME_MIN_LENGTH, MENU_NAME_MAX_LENGTH, {
    message: VMH.string.length(
      MENU_NAME_MIN_LENGTH,
      MENU_NAME_MAX_LENGTH,
      '菜单名称',
    ),
  })
  @IsString({ message: VMH.string.isString('菜单名称') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('菜单名称') })
  name: string;

  @IsEnum(MenuType, {
    message: VMH.number.isEnum(Object.values(MenuType), '菜单类型'),
  })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('菜单类型') })
  type: MenuType;

  @IsNumber({}, { message: VMH.number.isNumber('父级菜单ID') })
  @IsOptional()
  parentId?: number;

  @IsNumber({}, { message: VMH.number.isNumber('排序号') })
  @IsOptional()
  orderNum?: number;

  @Length(MENU_PATH_MIN_LENGTH, MENU_PATH_MAX_LENGTH, {
    message: VMH.string.length(
      MENU_PATH_MIN_LENGTH,
      MENU_PATH_MAX_LENGTH,
      '路径',
    ),
  })
  @IsString({ message: VMH.string.isString('路径') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('路径') })
  path: string;

  @Length(0, MENU_ICON_MAX_LENGTH, {
    message: VMH.string.length(0, MENU_ICON_MAX_LENGTH, '图标'),
  })
  @IsString({ message: VMH.string.isString('图标') })
  @IsOptional()
  icon?: string;

  @IsBoolean({ message: VMH.boolean.isBoolean('是否可见') })
  @IsOptional()
  isVisible?: boolean;

  @IsBoolean({ message: VMH.boolean.isBoolean('是否缓存') })
  @IsOptional()
  isCached?: boolean;

  @Length(0, MENU_LAYOUT_MAX_LENGTH, {
    message: VMH.string.length(0, MENU_LAYOUT_MAX_LENGTH, '布局'),
  })
  @IsString({ message: VMH.string.isString('布局') })
  @IsOptional()
  layout?: string;

  @IsEnum(MenuModule, {
    message: VMH.number.isEnum(Object.values(MenuModule), '所属模块'),
  })
  @IsOptional()
  module?: MenuModule;
}
