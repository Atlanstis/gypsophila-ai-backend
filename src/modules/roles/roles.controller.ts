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

import { ResponseMessage } from 'src/common';
import { JwtAuthGuard } from 'src/common';

import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from './dto';
import { RolesService } from './roles.service';
import {
  CreateRoleResponse,
  DeleteRoleResponse,
  QueryNonBuiltinRolesResponse,
  QueryRoleDetailResponse,
  QueryRoleListResponse,
  UpdateRoleResponse,
} from './types';

/**
 * 角色控制器
 */
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * 创建角色
   */
  @Post()
  @ResponseMessage('创建角色成功')
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<CreateRoleResponse['data']> {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * 查询角色列表
   */
  @Get()
  @ResponseMessage('查询角色列表成功')
  async findAll(
    @Query() query: QueryRoleDto,
  ): Promise<QueryRoleListResponse['data']> {
    return this.rolesService.findAll(query);
  }

  /**
   * 查询单个角色
   */
  @Get(':id')
  @ResponseMessage('查询角色详情成功')
  async findOne(
    @Param('id') id: string,
  ): Promise<QueryRoleDetailResponse['data']> {
    return this.rolesService.findOne(+id);
  }

  /**
   * 更新角色
   */
  @Patch(':id')
  @ResponseMessage('更新角色成功')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRoleResponse['data']> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  /**
   * 删除角色
   */
  @Delete(':id')
  @ResponseMessage('删除角色成功')
  async remove(@Param('id') id: string): Promise<DeleteRoleResponse['data']> {
    return await this.rolesService.remove(+id);
  }

  /**
   * 查询非内置角色列表
   */
  @Get('non-builtin')
  @ResponseMessage('查询非内置角色列表成功')
  async findNonBuiltinRoles(): Promise<QueryNonBuiltinRolesResponse['data']> {
    return await this.rolesService.findNonBuiltinRoles();
  }
}
