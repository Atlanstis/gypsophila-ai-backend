import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

/**
 * 创建用户DTO
 */
export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(0, 255)
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @IsOptional()
  @IsBoolean()
  isBuiltin?: boolean;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;
}
