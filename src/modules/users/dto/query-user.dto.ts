import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * 查询用户列表DTO
 */
export class QueryUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

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
