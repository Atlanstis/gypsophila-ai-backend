import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USER_AVATAR_MAX_LENGTH,
} from '../users.constants';

/**
 * 创建用户DTO
 */
export class CreateUserDto {
  @IsString()
  @Length(0, USER_AVATAR_MAX_LENGTH)
  @IsOptional()
  avatar?: string;

  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: `username 长度应在 ${USERNAME_MIN_LENGTH} 到 ${USERNAME_MAX_LENGTH} 之间`,
  })
  @IsString({ message: 'username 必须是字符串' })
  @IsNotEmpty({ message: 'username 不能为空' })
  username: string;

  @Length(NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsBoolean()
  @IsOptional()
  isBuiltin?: boolean;

  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  password: string;
}
