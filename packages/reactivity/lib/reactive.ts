import { def, isObject } from '@mini-dev-vue3/shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export const enum ReactiveFlags {
  SKIP = '__v_skip', // 标记一个对象，使其永远不会转换为 proxy
  IS_REACTIVE = '__v_isReactive', // 标记一个对象，由 reactive 创建的响应式代理
  IS_READONLY = '__v_isReadonly', // 标记一个对象，由 readonly 创建的只读代理
  RAW = '__v_raw' // 保存代理对象的原始对象
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.RAW]?: any
}

export const reactiveMap = new WeakMap<Target, any>()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()

//  返回对象的响应式代理 proxy
export function reactive(target: object) {
  return createReactiveObject(target, false, mutableHandlers, reactiveMap)
}

// 创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (暴露原始值)。
export function shallowReactive<T extends object>(target: T): any {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowReactiveMap
  )
}

// 接受一个对象 (响应式或纯对象) 或 ref 并返回原始对象的只读代理
export function readonly<T extends object>(target: T): any {
  return createReactiveObject(target, true, readonlyHandlers, readonlyMap)
}

// 创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。
export function shallowReadonly<T extends object>(target: T): any {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyMap
  )
}

// Target 目标对象
// isReadonly 是否只读
// baseHandlers 普通对象类型的 handlers
// collectionHandlers 主要针对(set、map、weakSet、weakMap)的 handlers
// proxyMap 原始对象和代理后的对象之间的映射字典
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  // collectionHandlers?: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  // 过滤基础类型
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // 传入是一个代理后的对象proxy 直接返回
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }

  // 传入的对象已经代理过 从字典获取proxy对象直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 过滤__v_skip标记对象（使其永远不会转换为 proxy）
  if (target[ReactiveFlags.SKIP]) {
    return target
  }

  const proxy = new Proxy(target, baseHandlers)

  // 原始对象和代理后的对象之间的建立映射关系
  proxyMap.set(target, proxy)
  return proxy
}

// 检查对象是否是由 reactive 创建的响应式代理
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

// 检查对象是否是由 readonly 创建的只读代理
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

// 检查对象是否是由 reactive 或 readonly 创建的 proxy
export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

// 返回 reactive 或 readonly 代理的原始对象
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

// 标记一个对象，使其永远不会转换为 proxy,返回对象本身。
export function markRaw<T extends object>(value: T): T {
  def(value, ReactiveFlags.SKIP, true)
  return value
}

export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

export const toReadonly = <T extends unknown>(value: T): T =>
  isObject(value) ? readonly(value as Record<any, any>) : value
