import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common/helpers/validation-message.helper';

import { IUpdateUserDto } from '../types/dto.types';
import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  USER_AVATAR_MAX_LENGTH,
} from '../users.constants';

/**
 * 更新用户DTO
 */
export class UpdateUserDto implements IUpdateUserDto {
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
  @IsOptional()
  nickname?: string;

  /**
   * 角色ID列表
   */
  @IsNumber(
    {},
    { each: true, message: VMH.number.isNumber('角色ID列表内各项') },
  )
  @IsArray({ message: VMH.array.isArray('角色ID列表') })
  @IsOptional()
  roles?: number[];
}
