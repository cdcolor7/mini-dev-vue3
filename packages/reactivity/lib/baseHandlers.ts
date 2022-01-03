import {
  extend,
  hasChanged,
  hasOwn,
  isArray,
  isObject
} from '@mini-dev-vue3/shared'
import { ReactiveFlags, readonly, reactive, Target } from './reactive'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

// 对象proxy
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty
}

// 对象proxy -- readonly
export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}

// 对象浅层proxy
export const shallowReactiveHandlers = extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
})

// 对象浅层proxy -- readonly
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})

// 实现 readonly只读  shallow 浅代理 深层代理
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string) {
    // IS_REACTIVE IS_READONLY RAW属性的值返回
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.RAW) {
      return target
    }
    const res = Reflect.get(target, key)
    // console.log(`get: ${key}`)
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key) // 依赖收集 代理的只读对象无需进行依赖收集
    }
    if (shallow) {
      // 浅层代理直接返回
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res) // 嵌套对象的代码
    }
    return res
  }
}

// shallow 浅代理 深层代码
function createSetter(shallow = false) {
  return function set(target: object, key: string, value: unknown) {
    let oldValue = (target as any)[key]
    const hadKey = isArray(target)
      ? Number(key) < target.length
      : hasOwn(target, key)
    const result = Reflect.set(target, key, value)
    // console.log(`set: ${key}`)
    if (!hadKey) {
      trigger(target, TriggerOpTypes.ADD, key) // 新增属性触发更新
    } else if (hasChanged(value, oldValue)) {
      trigger(target, TriggerOpTypes.SET, key) // 属性存在 修改时 触发更新
    }
    return result
  }
}

// 属性删除
function deleteProperty(target: object, key: string): boolean {
  const hadKey = hasOwn(target, key)
  // const oldValue = (target as any)[key]
  const result = Reflect.deleteProperty(target, key)
  // console.log(`del: ${key}`)
  if (result && hadKey) {
    trigger(target, TriggerOpTypes.DELETE, key) // 属性存在式的 删除时 更新
  }
  return result
}
