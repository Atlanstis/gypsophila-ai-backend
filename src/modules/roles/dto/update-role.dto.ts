import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

/**
 * 更新角色DTO
 */
export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isBuiltin?: boolean;
}
