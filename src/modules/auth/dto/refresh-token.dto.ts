import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationMessageHelper as VMH } from 'src/common';

export class RefreshTokenDto {
  /**
   * 刷新令牌
   */
  @IsString({ message: VMH.string.isString('refreshToken') })
  @IsNotEmpty({
    message: VMH.common.isNotEmpty('refreshToken'),
  })
  refreshToken: string;
}
