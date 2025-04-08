/**
 * 菜单模块业务类型定义
 */
import { IMenuEntity } from './entity.types';

/**
 * 菜单树节点类型
 */
export interface MenuTreeNode extends Omit<IMenuEntity, 'children'> {
  /**
   * 子菜单
   */
  children?: MenuTreeNode[];
}
