import { RootRenderFunction } from './renderer'
import { createVNode } from './vnode'
import { NO } from '@mini-dev-vue3/shared'

export type CreateAppFunction<HostElement> = (rootComponent: any) => any

export interface App<HostElement = any> {
  version: string
  mount(rootContainer: HostElement | string): any
  _uid: number
  _component: any
  _context: any
  _instance: any
}

let uid = 0

// 返回app实例的工厂函数
export function createAppAPI<HostElement>(
  render: RootRenderFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent) {
    const context = createAppContext()
    const app: App = {
      _uid: uid++,
      _component: rootComponent,
      _context: context,
      _instance: null,
      version: __VERSION__,
      mount(rootContainer) {
        // 创建根组件的vnode
        const vnode = createVNode(rootComponent)
        // 基于 vnode 进行渲染
        render(vnode, rootContainer)
      }
    }
    return app
  }
}

export function createAppContext(): any {
  // AppContext
  return {
    app: null as any,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: undefined,
      warnHandler: undefined,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  }
}
