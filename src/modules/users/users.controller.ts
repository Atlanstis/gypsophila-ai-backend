import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResponseMessage } from 'src/common';

import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CreateUserResponse,
  DeleteUserResponse,
  QueryUserDetailResponse,
  QueryUserListResponse,
  UpdateUserResponse,
} from './types/api.types';
import { UsersService } from './users.service';

/**
 * 用户控制器
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 创建用户
   */
  @Post()
  @ResponseMessage('创建用户成功')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse['data']> {
    await this.usersService.create(createUserDto);
    return null;
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
    @Param('id') id: string,
  ): Promise<QueryUserDetailResponse['data']> {
    return this.usersService.findOne(id);
  }

  /**
   * 更新用户
   */
  @Patch(':id')
  @ResponseMessage('更新用户成功')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse['data']> {
    await this.usersService.update(id, updateUserDto);
    return null;
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  @ResponseMessage('删除用户成功')
  async remove(@Param('id') id: string): Promise<DeleteUserResponse['data']> {
    await this.usersService.remove(id);
    return null;
  }
}
