import { IsNotEmpty, IsString } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common';

import { ILoginDto } from '../types/dto.types';

export class LoginDto implements ILoginDto {
  /**
   * 用户名
   */
  @IsString({ message: VMH.string.isString('username') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('username') })
  username: string;

  /**
   * 密码
   */
  @IsString({ message: VMH.string.isString('password') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('password') })
  password: string;
}
