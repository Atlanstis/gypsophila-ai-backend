import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common/helpers/validation-message.helper';

import {
  PERMISSION_KEY_MAX_LENGTH,
  PERMISSION_KEY_MIN_LENGTH,
  PERMISSION_NAME_MAX_LENGTH,
  PERMISSION_NAME_MIN_LENGTH,
} from '../menus.constants';
import { ICreatePermissionDto } from '../types/dto.types';

/**
 * 创建权限DTO
 */
export class CreatePermissionDto implements ICreatePermissionDto {
  @IsNumber({}, { message: VMH.number.isNumber('菜单ID') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('菜单ID') })
  menuId: number;

  @Length(PERMISSION_KEY_MIN_LENGTH, PERMISSION_KEY_MAX_LENGTH, {
    message: VMH.string.length(
      PERMISSION_KEY_MIN_LENGTH,
      PERMISSION_KEY_MAX_LENGTH,
      '权限标识',
    ),
  })
  @IsString({ message: VMH.string.isString('权限标识') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('权限标识') })
  key: string;

  @Length(PERMISSION_NAME_MIN_LENGTH, PERMISSION_NAME_MAX_LENGTH, {
    message: VMH.string.length(
      PERMISSION_NAME_MIN_LENGTH,
      PERMISSION_NAME_MAX_LENGTH,
      '权限名称',
    ),
  })
  @IsString({ message: VMH.string.isString('权限名称') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('权限名称') })
  name: string;
}
