import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DecryptField, JwtAuthGuard, ResponseMessage } from 'src/common';
import { UuidValidationPipeFactory as UuidValidationPipe } from 'src/common';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import {
  CreateUserResponse,
  DeleteUserResponse,
  QueryUserDetailResponse,
  QueryUserListResponse,
  UpdateUserResponse,
} from './types';
import { UsersService } from './users.service';

/**
 * 用户控制器
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 创建用户
   */
  @Post()
  @ResponseMessage('用户创建成功')
  async create(
    @Body(DecryptField('password')) createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse['data']> {
    return await this.usersService.create(createUserDto);
  }

  /**
   * 查询用户列表
   */
  @Get()
  @ResponseMessage('查询用户列表成功')
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<QueryUserListResponse['data']> {
    return this.usersService.findAll(query);
  }

  /**
   * 查询单个用户
   */
  @Get(':id')
  @ResponseMessage('查询用户详情成功')
  async findOne(
    @Param('id', UuidValidationPipe.create('用户ID')) id: string,
  ): Promise<QueryUserDetailResponse['data']> {
    return this.usersService.findOne(id);
  }

  /**
   * 更新用户
   */
  @Patch(':id')
  @ResponseMessage('用户更新成功')
  async update(
    @Param('id', UuidValidationPipe.create('用户ID')) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse['data']> {
    return await this.usersService.update(id, updateUserDto);
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  @ResponseMessage('删除用户成功')
  async remove(
    @Param('id', UuidValidationPipe.create('用户ID')) id: string,
  ): Promise<DeleteUserResponse['data']> {
    return await this.usersService.remove(id);
  }
}
