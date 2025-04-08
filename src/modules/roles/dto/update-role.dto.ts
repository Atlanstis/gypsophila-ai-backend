import { IsOptional, IsString, Length } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common';

import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '../roles.constants';
import { IUpdateRoleDto } from '../types/dto.types';

/**
 * 更新角色DTO
 */
export class UpdateRoleDto implements IUpdateRoleDto {
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
  @IsOptional()
  name?: string;

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
