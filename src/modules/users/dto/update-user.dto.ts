import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USER_AVATAR_MAX_LENGTH,
} from '../users.constants';

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
  @Length(NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH)
  @IsOptional()
  nickname?: string;

  @IsBoolean()
  @IsOptional()
  isBuiltin?: boolean;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;
}
