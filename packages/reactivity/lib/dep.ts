// 用于存储所有的 effect 对象
export function createDep(effects?: any) {
  const dep = new Set(effects)
  return dep
}
