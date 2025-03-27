import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 查询角色列表DTO
 */
export class QueryRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isBuiltin?: boolean;

  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @IsOptional()
  @Type(() => Number)
  current?: number = 1;
}
