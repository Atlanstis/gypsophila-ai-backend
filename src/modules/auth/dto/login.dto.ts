import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationMessageHelper as VMH } from 'src/common/helpers/validation-message.helper';

export class LoginDto {
  /**
   * 用户名
   */
  @IsString({ message: VMH.string.isString('username') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('username') })
  username: string;

  /**
   * 密码
   */
  @IsString({ message: VMH.string.isString('username') })
  @IsNotEmpty({ message: VMH.common.isNotEmpty('username') })
  password: string;
}
