import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 加密数据传输对象
 */
export class EncryptedDataDto {
  @IsNotEmpty({ message: '加密数据不能为空' })
  @IsString({ message: '加密数据必须是字符串' })
  encryptedData: string;
}
