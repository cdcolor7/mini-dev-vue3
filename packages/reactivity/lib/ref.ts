import { hasChanged, isArray } from '@mini-dev-vue3/shared'
import { createDep } from './dep'
import { toRaw, toReactive, isProxy, isReactive } from './reactive'
import { trackEffects, triggerEffects, isTracking } from './effect'

export interface Ref<T = any> {
  value: T
  _shallow?: boolean
}

// 接受一个内部值并返回一个响应式且可变的 ref 对象
export function ref(value?: unknown) {
  return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

// 检查值是否为一个 ref 对象
export function isRef(r: any): r is Ref {
  return Boolean(r && r.__v_isRef === true)
}

// 如果参数是一个 ref，则返回内部值，否则返回参数本身。
export function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}

// 将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 ref。
export function toRefs<T extends object>(object: T): any {
  if (__DEV__ && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}

// 可以用来为源响应式对象上的某个 property 新创建一个 ref
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): any {
  const val = object[key]
  return isRef(val) ? val : (new ObjectRefImpl(object, key) as any)
}

// 这个函数的目的是
// 帮助解构 ref
// 比如在 template 中使用 ref 的时候，直接使用就可以了
// 例如： const count = ref(0) -> 在 template 中使用的话 可以直接 count
// 解决方案就是通过 proxy 来对 ref 做处理
const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  }
}

// 代理ref
// reactive 里面如果有 ref 类型的 key 的话， 那么也是不需要调用 ref.value
export function proxyRefs<T extends object>(objectWithRefs: T): any {
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}

// reactive对象的ref处理
class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(private readonly _object: T, private readonly _key: K) {}

  get value() {
    return this._object[this._key]
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public dep: any
  public readonly __v_isRef = true

  constructor(value: T, public readonly _shallow: boolean) {
    this._rawValue = _shallow ? value : toRaw(value)
    this._value = _shallow ? value : toReactive(value)
    this.dep = createDep()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    newVal = this._shallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : toReactive(newVal)
      triggerRefValue(this)
    }
  }
}

export function triggerRefValue(ref: any) {
  triggerEffects(ref.dep)
}

export function trackRefValue(ref: any) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}
