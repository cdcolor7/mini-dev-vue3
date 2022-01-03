import { ShapeFlags } from '@mini-dev-vue3/shared'

export function initSlots(instance: any, children: any) {
  const { vnode } = instance

  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, (instance.slots = {}))
  }
}

const normalizeSlotValue = (value: any) => {
  // 把 function 返回的值转换成 array ，这样 slot 就可以支持多个元素了
  return Array.isArray(value) ? value : [value]
}

const normalizeObjectSlots = (rawSlots: any, slots: any) => {
  for (const key in rawSlots) {
    const value = rawSlots[key]
    if (typeof value === 'function') {
      // 把这个函数给到slots 对象上存起来
      // 后续在 renderSlots 中调用
      // TODO 这里没有对 value 做 normalize，
      // 默认 slots 返回的就是一个 vnode 对象
      slots[key] = (props: any) => normalizeSlotValue(value(props))
    }
  }
}
