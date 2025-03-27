import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import {
  USER_AVATAR_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
} from '../constants';

/**
 * 更新用户DTO
 */
export class UpdateUserDto {
  @IsString()
  @Length(0, USER_AVATAR_MAX_LENGTH)
  @IsOptional()
  avatar?: string;

  @IsString()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  @IsOptional()
  username?: string;

  @IsString()
  @Length(USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH)
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isBuiltin?: boolean;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;
}
