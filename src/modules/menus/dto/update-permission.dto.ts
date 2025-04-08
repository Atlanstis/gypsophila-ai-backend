import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common/helpers/validation-message.helper';

import {
  PERMISSION_KEY_MAX_LENGTH,
  PERMISSION_KEY_MIN_LENGTH,
  PERMISSION_NAME_MAX_LENGTH,
  PERMISSION_NAME_MIN_LENGTH,
} from '../menus.constants';
import { IUpdatePermissionDto } from '../types/dto.types';

/**
 * 更新权限DTO
 */
export class UpdatePermissionDto implements IUpdatePermissionDto {
  @IsNumber({}, { message: VMH.number.isNumber('菜单ID') })
  @IsOptional()
  menuId?: number;

  @Length(PERMISSION_KEY_MIN_LENGTH, PERMISSION_KEY_MAX_LENGTH, {
    message: VMH.string.length(
      PERMISSION_KEY_MIN_LENGTH,
      PERMISSION_KEY_MAX_LENGTH,
      '权限标识',
    ),
  })
  @IsString({ message: VMH.string.isString('权限标识') })
  @IsOptional()
  key?: string;

  @Length(PERMISSION_NAME_MIN_LENGTH, PERMISSION_NAME_MAX_LENGTH, {
    message: VMH.string.length(
      PERMISSION_NAME_MIN_LENGTH,
      PERMISSION_NAME_MAX_LENGTH,
      '权限名称',
    ),
  })
  @IsString({ message: VMH.string.isString('权限名称') })
  @IsOptional()
  name?: string;
}
