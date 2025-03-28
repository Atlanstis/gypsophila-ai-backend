import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 查询用户列表DTO
 */
export class QueryUserDto {
  @IsOptional()
  @IsString()
  username?: string;

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
