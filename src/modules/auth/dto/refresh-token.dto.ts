import { IsNotEmpty, IsString } from 'class-validator';

import { ValidationMessageHelper as VMH } from 'src/common';

import { IRefreshTokenDto } from '../types/dto.types';

export class RefreshTokenDto implements IRefreshTokenDto {
  /**
   * 刷新令牌
   */
  @IsString({ message: VMH.string.isString('refreshToken') })
  @IsNotEmpty({
    message: VMH.common.isNotEmpty('refreshToken'),
  })
  refreshToken: string;
}
