import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '../constants';

/**
 * 更新角色DTO
 */
export class UpdateRoleDto {
  @IsString()
  @Length(ROLE_NAME_MIN_LENGTH, ROLE_NAME_MAX_LENGTH)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(0, ROLE_DESCRIPTION_MAX_LENGTH)
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isBuiltin?: boolean;
}
