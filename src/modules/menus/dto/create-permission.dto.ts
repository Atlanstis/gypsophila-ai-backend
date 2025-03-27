import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

/**
 * 创建权限DTO
 */
export class CreatePermissionDto {
  @IsNotEmpty()
  @IsNumber()
  menuId: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  key: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 16)
  name: string;
}
