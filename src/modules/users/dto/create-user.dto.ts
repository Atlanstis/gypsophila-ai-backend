import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common';

import { ICreateUserDto } from '../types/dto.types';
import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USER_AVATAR_MAX_LENGTH,
} from '../users.constants';

/**
 * 创建用户DTO
 */
export class CreateUserDto implements ICreateUserDto {
  /**
   * 用户头像
   */
  @Length(0, USER_AVATAR_MAX_LENGTH, {
    message: VMH.string.length(0, USER_AVATAR_MAX_LENGTH, '用户头像'),
  })
  @IsString({ message: VMH.string.isString('用户头像') })
  @IsOptional()
  avatar?: string;

  /**
   * 用户名
   */
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
    message: '用户名只能包含英文字母、数字和下划线，且必须以英文字母开头',
  })
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: VMH.string.length(
      USERNAME_MIN_LENGTH,
      USERNAME_MAX_LENGTH,
      '用户名',
    ),
  })
  @IsString({ message: VMH.string.isString('用户名') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('用户名') })
  username: string;

  /**
   * 用户昵称
   */
  @Length(NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH, {
    message: VMH.string.length(
      NICKNAME_MIN_LENGTH,
      NICKNAME_MAX_LENGTH,
      '用户昵称',
    ),
  })
  @IsString({ message: VMH.string.isString('用户昵称') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('用户昵称') })
  nickname: string;

  /**
   * 用户密码
   */
  @IsString({ message: VMH.string.isString('密码') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('密码') })
  password: string;

  /**
   * 角色ID列表
   */
  @IsNumber(
    {},
    { each: true, message: VMH.number.isNumber('角色ID列表内各项') },
  )
  @ArrayNotEmpty({ message: VMH.common.isNotEmpty('角色ID列表') })
  @IsArray({ message: VMH.array.isArray('角色ID列表') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('角色ID列表') })
  roles: number[];
}
