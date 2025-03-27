import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

/**
 * 更新权限DTO
 */
export class UpdatePermissionDto {
  @IsOptional()
  @IsNumber()
  menuId?: number;

  @IsOptional()
  @IsString()
  @Length(2, 32)
  key?: string;

  @IsOptional()
  @IsString()
  @Length(2, 16)
  name?: string;
}
