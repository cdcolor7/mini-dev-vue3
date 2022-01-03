import { VNode, Fragment, Text } from './vnode'
import { createAppAPI, CreateAppFunction } from './apiCreateApp'
import { ShapeFlags } from '@mini-dev-vue3/shared'
import { createComponentInstance, setupComponent } from './component'
import { ReactiveEffect } from '@mini-dev-vue3/reactivity'
import { queueJob, SchedulerJob } from './scheduler'
export interface Renderer<HostElement = RendererElement> {
  render: RootRenderFunction<HostElement>
  createApp: CreateAppFunction<HostElement>
}

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: VNode | null,
  container: HostElement,
  isSVG?: boolean
) => void

export interface RendererElement extends RendererNode {}

export interface RendererNode {
  [key: string]: any
}

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
> {
  insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
  remove(el: HostNode): void
  createElement(
    type: string,
    isSVG?: boolean,
    isCustomizedBuiltIn?: string
  ): HostElement
  createText(text: string): HostNode
  setText(node: HostNode, text: string): void
  setElementText(node: HostElement, text: string): void
  parentNode(node: HostNode): HostElement | null
  nextSibling(node: HostNode): HostNode | null
  querySelector?(selector: string): HostElement | null
  cloneNode?(node: HostNode): HostNode
}

type PatchFn = (
  n1: VNode | null, // null means this is a mount
  n2: VNode,
  container: RendererElement,
  anchor?: RendererNode | null,
  parentComponent?: any
) => void

type ProcessTextOrCommentFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement
) => void

export type MountComponentFn = (
  initialVNode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: any
) => void

export type SetupRenderEffectFn = (
  instance: any,
  initialVNode: VNode,
  container: RendererElement,
  anchor: RendererNode | null
) => void

export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options: RendererOptions): any {
  const render: RootRenderFunction = (vnode, container) => {
    if (vnode == null) {
      if (container._vnode) {
        // unmount(container._vnode, null, null, true)
      }
    } else {
      patch(null, vnode, container)
    }
    // flushPostFlushCbs()
    container._vnode = vnode
  }

  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    cloneNode: hostCloneNode
  } = options

  const patch: PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null
  ) => {
    if (n1 === n2) {
      return
    }
    // console.log('patch start');
    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      case Fragment:
        console.log('Fragment')
        // processFragment(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor, parentComponent)
          // processElement(n1, n2, container)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, anchor, parentComponent)
        }
    }
  }

  // 组件处理函数
  const processComponent = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: any
  ) => {
    if (n1 == null) {
      // 组件挂载 - KeepAlive暂未实现
      mountComponent(n2, container, anchor, parentComponent)
    } else {
      // updateComponent(n1, n2, container) // 组件更新
    }
  }

  const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: any
  ) => {
    if (!n1) {
      mountElement(n2, container, anchor, parentComponent) // 节点挂载
    } else {
      // patchElement(n1, n2, parentComponent); // 节点更新
    }
  }

  const mountElement = (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: any
  ) => {
    const { shapeFlag, props } = vnode
    // 1. 先创建 element
    // 基于可扩展的渲染 api
    const el = (vnode.el = hostCreateElement(vnode.type))
    // 支持单子组件和多子组件的创建
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 子节点为文本
      hostSetElementText(el, vnode.children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 子节点为数组就需要依次调用 patch 递归来处理
      mountChildren(vnode.children, el)
    }
    // 处理 props
    if (props) {
      for (const key in props) {
        // todo
        // 需要过滤掉vue自身用的key
        // 比如生命周期相关的 key: beforeMount、mounted
        const nextVal = props[key]
        // hostPatchProp(el, key, null, nextVal);
      }
    }

    hostInsert(el, container, anchor)
  }

  function mountChildren(children: any, container: any) {
    children.forEach((VNodeChild: any) => {
      // todo
      // 这里应该需要处理一下 vnodeChild
      // 因为有可能不是 vnode 类型
      patch(null, VNodeChild, container)
    })
  }

  // 组件创建
  // 1. 创建组件实例 instance 2.  给 instance 加工 3. 安装渲染函数副作用
  const mountComponent: MountComponentFn = (
    initialVNode,
    container,
    anchor,
    parentComponent
  ) => {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ))

    // 组件安装
    setupComponent(instance)

    // 安装渲染函数副作用
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  const setupRenderEffect: SetupRenderEffectFn = (
    instance,
    initialVNode,
    container,
    anchor
  ) => {
    // 组件更新函数
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        const { bm, m, parent } = instance
        // beforeMount hook
        if (bm) {
          // invokeArrayFns(bm) // 触发 beforeMount 生命周期钩子
        }
        // 组件初始化的时候会执行
        // 在 effect 内调用 render 才能触发依赖收集
        // 等到后面响应式的值变更后会再次触发这个函数
        const proxyToUse = instance.proxy
        // 可在 render 函数中通过 this 来使用 proxy
        const subTree = (instance.subTree = instance.render.call(
          proxyToUse,
          proxyToUse
        ))
        patch(null, subTree, container, anchor, instance)
        initialVNode.el = subTree.el
        // mounted hook
        if (m) {
          // queuePostRenderEffect(m, parentSuspense) // 触发 Mounted生命周期钩子
        }
        instance.isMounted = true
      } else {
        // 拿到最新的 subTree
        const { next, vnode, bu, u } = instance

        // 如果有 next 的话， 说明需要更新组件的数据（props，slots 等）
        // 先更新组件的数据，然后更新完成后，在继续对比当前组件的子元素
        if (next) {
          next.el = vnode.el
          updateComponentPreRender(instance, next)
        }

        const proxyToUse = instance.proxy
        const nextTree = instance.render.call(proxyToUse, proxyToUse)
        // 替换之前的 subTree
        const prevTree = instance.subTree
        instance.subTree = nextTree

        // beforeUpdate hook
        if (bu) {
          // invokeArrayFns(bu) // 触发 beforeUpdate 生命周期钩子
        }

        // 用旧的 vnode 和新的 vnode 交给 patch 来处理
        patch(prevTree, nextTree, prevTree.el, null, instance)

        // 触发 updated hook
        // updated hook
        if (u) {
          // queuePostRenderEffect(u, parentSuspense) // 触发 Updated 生命周期钩子
        }
      }
    }

    function updateComponentPreRender(instance: any, nextVNode: VNode) {
      const { props } = nextVNode
      // console.log("更新组件的 props", props);
      instance.props = props
      // console.log("更新组件的 slots");
      // TODO 更新组件的 slots
    }

    // 创建副作用函数用于 组件更新
    const effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(instance.update)
      // instance.scope
    )
    const update = (instance.update = effect.run.bind(effect) as SchedulerJob)
    update.id = instance.uid
    effect.allowRecurse = update.allowRecurse = true
    update()
  }

  // 创建文本节点
  const processText: ProcessTextOrCommentFn = (n1, n2, container) => {
    console.log('处理 Text 节点')
    if (n1 === null) {
      // n1是null 说明是在初始化挂载阶段
      hostInsert((n2.el = hostCreateText(n2.children as string)), container)
    } else {
      // update
      // 先对比一下 updated 之后的内容是否和之前的不一样
      // 在不一样的时候才需要 update text
      // 这里抽离出来的接口是 setText
      // 注意，这里一定要记得把 n1.el 赋值给 n2.el, 不然后续是找不到值的
      const el = (n2.el = n1.el!)
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children as string)
      }
    }
  }

  return {
    render,
    createApp: createAppAPI(render)
  }
}
