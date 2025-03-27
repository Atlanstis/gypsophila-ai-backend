import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

/**
 * 更新用户DTO
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(0, 255)
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsBoolean()
  isBuiltin?: boolean;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;
}
