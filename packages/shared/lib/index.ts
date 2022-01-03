import { makeMap } from './makeMap'

export { makeMap }
export * from './patchFlags'
export * from './shapeFlags'
export * from './slotFlags'
export * from './domTagConfig'

export const NOOP = () => {}
export const NO = () => false
// 必须有on+大写字母的格式开头
const onRe = /^on[^a-z]/
export const isOn = (key: string) => onRe.test(key)

export const extend = Object.assign

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol): boolean =>
  hasOwnProperty.call(val, key)

export const isArray = Array.isArray
export const isString = (val: unknown): val is string => typeof val === 'string' // is类型保护
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

const camelizeRE = /-(\W)/g
/**
 * @private
 * vue-text-name => vueTextName
 */
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}

// 对比某个值是否已更改
export const hasChange = (val: any, oldVal: any): boolean => {
  return !Object.is(val, oldVal)
}

/**
 * @private
 * 手写字母大写
 */
export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}

/**
 * @private
 * 添加 on 前缀，并且首字母大写
 */
export const toHandlerKey = (str: string) => {
  return str ? `on${capitalize(str)}` : ``
}

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}
