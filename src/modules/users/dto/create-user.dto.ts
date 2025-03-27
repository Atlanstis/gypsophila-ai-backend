import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USER_AVATAR_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
} from '../constants';

/**
 * 创建用户DTO
 */
export class CreateUserDto {
  @IsString()
  @Length(0, USER_AVATAR_MAX_LENGTH)
  @IsOptional()
  avatar?: string;

  @IsString()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH)
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isBuiltin?: boolean;

  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  password: string;
}
