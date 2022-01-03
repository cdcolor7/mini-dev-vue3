// 补丁标记 编译器优化
export const enum PatchFlags {
  TEXT = 1, // 动态文本
  CLASS = 1 << 1, // 动态的class
  STYLE = 1 << 2, // 动态的样式 style
  PROPS = 1 << 3, // 动态属性 不包括 class style
  FULL_PROPS = 1 << 4, //动态 key，当 key 变化时需要完整的 diff 算法做比较 <div :[foo]="bar">Hello</div>
  HYDRATE_EVENTS = 1 << 5, //-- 带有监听事件的节点
  STABLE_FRAGMENT = 1 << 6, // 一个不会改变子节点顺序的Fragment
  KEYED_FRAGMENT = 1 << 7, // 子节点带有 key 属性的 Fragment
  UNKEYED_FRAGMENT = 1 << 8, // 子节点没有 key 的 Fragment
  NEED_PATCH = 1 << 9, // 只有非props需要patch的，比如 ref或hooks
  DYNAMIC_SLOTS = 1 << 10, // 动态的slot
  DEV_ROOT_FRAGMENT = 1 << 11, // 表示模板的根级别放置注释而创建的片段。 这是一个仅用于开发的标志，因为注释在生产中被剥离
  HOISTED = -1, // 表示已提升的静态vnode,更新时调过整个子树
  BAIL = -2 // 指示diff算法应该结束优化模式
}

/**
 * 开发人员使用 - 名称映射
 */
 export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.HYDRATE_EVENTS]: `HYDRATE_EVENTS`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.DEV_ROOT_FRAGMENT]: `DEV_ROOT_FRAGMENT`,
  [PatchFlags.HOISTED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`
}
