/**
 * 类型定义入口文件
 * 用于导出所有API接口的类型定义
 */
// 导入所需的API接口
import { AuthApi } from './auth/auth.types';
import { MenuApi } from './menus/menus.types';
import { RoleApi } from './roles/roles.types';
import { UserApi } from './users/users.types';

// 导出通用响应接口
export * from './common/response.types';

// 导出认证模块接口
export * from './auth/auth.types';

// 导出用户模块接口
export * from './users/users.types';

// 导出菜单模块接口
export * from './menus/menus.types';

// 导出角色模块接口
export * from './roles/roles.types';

/**
 * 完整的API接口集合
 */
export interface GypsophilaApi {
  /**
   * 认证接口
   */
  auth: AuthApi;

  /**
   * 用户接口
   */
  users: UserApi;

  /**
   * 菜单接口
   */
  menus: MenuApi;

  /**
   * 角色接口
   */
  roles: RoleApi;
}
