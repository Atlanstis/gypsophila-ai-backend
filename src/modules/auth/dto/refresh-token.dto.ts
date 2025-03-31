import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 刷新令牌请求DTO
 */
export class RefreshTokenDto {
  /**
   * 刷新令牌
   */
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  @IsString({ message: '刷新令牌必须是字符串' })
  refreshToken: string;
}
