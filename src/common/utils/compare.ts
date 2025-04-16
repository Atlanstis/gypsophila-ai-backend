/**
 * 比较两个数组，返回需要删除和添加的项
 * @param oldItems 旧数组
 * @param newItems 新数组
 * @returns 包含需要删除和添加项的对象
 */
export function compareArrays<T>(
  oldItems: T[],
  newItems: T[],
): {
  itemsToDelete: T[];
  itemsToAdd: T[];
} {
  // 需要删除的项列表
  const itemsToDelete = oldItems.filter(
    (oldItem) => !newItems.includes(oldItem),
  );

  // 需要添加的项列表
  const itemsToAdd = newItems.filter((newItem) => !oldItems.includes(newItem));

  return { itemsToDelete, itemsToAdd };
}
