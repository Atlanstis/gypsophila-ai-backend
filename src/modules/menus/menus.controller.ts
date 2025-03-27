import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

/**
 * 菜单控制器
 */
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  /**
   * 创建菜单
   */
  @Post()
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.createMenu(createMenuDto);
  }

  /**
   * 查询菜单列表
   */
  @Get()
  findAllMenus(@Query() query: QueryMenuDto) {
    return this.menusService.findAllMenus(query);
  }

  /**
   * 查询单个菜单
   */
  @Get(':id')
  findOneMenu(@Param('id') id: string) {
    return this.menusService.findOneMenu(+id);
  }

  /**
   * 更新菜单
   */
  @Patch(':id')
  updateMenu(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.updateMenu(+id, updateMenuDto);
  }

  /**
   * 删除菜单
   */
  @Delete(':id')
  removeMenu(@Param('id') id: string) {
    return this.menusService.removeMenu(+id);
  }

  /**
   * 创建权限
   */
  @Post('permissions')
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.menusService.createPermission(createPermissionDto);
  }

  /**
   * 查询权限列表
   */
  @Get('permissions')
  findAllPermissions(@Query('menuId') menuId?: string) {
    return this.menusService.findAllPermissions(menuId ? +menuId : undefined);
  }

  /**
   * 查询单个权限
   */
  @Get('permissions/:id')
  findOnePermission(@Param('id') id: string) {
    return this.menusService.findOnePermission(+id);
  }

  /**
   * 更新权限
   */
  @Patch('permissions/:id')
  updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.menusService.updatePermission(+id, updatePermissionDto);
  }

  /**
   * 删除权限
   */
  @Delete('permissions/:id')
  removePermission(@Param('id') id: string) {
    return this.menusService.removePermission(+id);
  }
}
