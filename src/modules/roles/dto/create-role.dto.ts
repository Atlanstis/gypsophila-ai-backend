import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common';

import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '../roles.constants';
import { ICreateRoleDto } from '../types/dto.types';

/**
 * 创建角色DTO
 */
export class CreateRoleDto implements ICreateRoleDto {
  /**
   * 角色名称
   */
  @Length(ROLE_NAME_MIN_LENGTH, ROLE_NAME_MAX_LENGTH, {
    message: VMH.string.length(
      ROLE_NAME_MIN_LENGTH,
      ROLE_NAME_MAX_LENGTH,
      '角色名称',
    ),
  })
  @IsString({ message: VMH.string.isString('角色名称') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('角色名称') })
  name: string;

  /**
   * 角色描述
   */
  @Length(0, ROLE_DESCRIPTION_MAX_LENGTH, {
    message: VMH.string.length(0, ROLE_DESCRIPTION_MAX_LENGTH, '角色描述'),
  })
  @IsString({ message: VMH.string.isString('角色描述') })
  @IsOptional()
  description?: string;
}
