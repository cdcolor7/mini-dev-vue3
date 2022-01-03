// 标记节点类型
export const enum ShapeFlags {
  ELEMENT = 1, // 节点
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数组件
  STATEFUL_COMPONENT = 1 << 2,  // 普通组件
  TEXT_CHILDREN = 1 << 3,  // 子节点为文本
  ARRAY_CHILDREN = 1 << 4, // 子节点为数组
  SLOTS_CHILDREN = 1 << 5, // 子节点为插槽
  TELEPORT = 1 << 6, // 传送门
  SUSPENSE = 1 << 7, // 异步组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 需要被 KeeyAlive的组件
  COMPONENT_KEPT_ALIVE = 1 << 9, // 已经被KeepAlive的组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 组件
}