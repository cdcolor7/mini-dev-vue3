import { TrackOpTypes, TriggerOpTypes } from './operations'
import { extend } from '@mini-dev-vue3/shared'
import { createDep } from './dep'

const targetMap = new WeakMap()

export type EffectScheduler = (...args: any[]) => any
export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
  scope?: any
  allowRecurse?: boolean
  onStop?: () => void
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

// 返回副作用函数
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  const _effect = new ReactiveEffect(fn)
  // 把用户传过来的值合并到 _effect 对象上去
  if (options) {
    extend(_effect, options)
  }

  // 执行effect
  if (!options || !options.lazy) {
    _effect.run()
  }

  // 返回_effect.run 让用户可以自行选择调用的时机（调用 fn）
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  active = true
  deps: any[] = []
  allowRecurse?: boolean
  onStop?: () => void

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: any
  ) {}

  run() {
    // 只执行 不进行依赖收集
    if (!this.active) {
      return this.fn()
    }
    // 执行fn收集依赖
    if (!effectStack.includes(this)) {
      try {
        effectStack.push((activeEffect = this)) // 入栈  activeEffect 当前进行进行依赖收集的 ReactiveEffect实例
        enableTracking()
        return this.fn() // 执行用户传入的fn函数
      } finally {
        resetTracking()
        effectStack.pop() // 出栈
        const n = effectStack.length
        activeEffect = n > 0 ? effectStack[n - 1] : undefined // activeEffect 切换为栈顶正在执行的 ReactiveEffect实例
      }
    }
  }

  stop() {
    if (this.active) {
      // 这是为了防止重复的调用，执行 stop 逻辑
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

let shouldTrack = true
const trackStack: boolean[] = []

export function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

export function resetTracking() {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

// 找到所有依赖这个 effect 的响应式对象
// 从这些响应式对象里面把 effect 给删除掉
function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}

// 判断是否在依赖收集
export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

// 依赖收集
export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (!isTracking()) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = createDep()
    depsMap.set(key, dep)
  }

  trackEffects(dep)
  /*
    开发中
  */
}

export function trackEffects(dep: any) {
  // 用 dep 来存放所有的 effect
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect!.deps.push(dep) // !ts的非空断言
  }
}

// 触发更新
export function trigger(target: object, type: TriggerOpTypes, key?: unknown) {
  // 判断代理对象在targetMap是否存在
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  // 先收集所有的 dep 放到 deps 里面 后面会统一处理
  let deps: any[] = []

  const dep = depsMap.get(key)

  deps.push(dep) // 暂时只实现了 GET 类型

  const effects: Array<any> = []
  deps.forEach(dep => {
    // 这里解构 dep 得到的是 dep 内部存储的 effect
    effects.push(...dep)
  })

  triggerEffects(createDep(effects))
}

// 执行收集到的所有的 effect 的 run 方法
export function triggerEffects(dep: any) {
  for (const effect of dep) {
    if (effect.scheduler) {
      // scheduler 可以让用户自己选择调用的时机
      // 这样就可以灵活的控制调用了
      // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
