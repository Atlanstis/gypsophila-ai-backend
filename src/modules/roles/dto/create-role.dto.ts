import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '../constants';

/**
 * 创建角色DTO
 */
export class CreateRoleDto {
  @IsString()
  @Length(ROLE_NAME_MIN_LENGTH, ROLE_NAME_MAX_LENGTH)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(0, ROLE_DESCRIPTION_MAX_LENGTH)
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isBuiltin?: boolean;
}
