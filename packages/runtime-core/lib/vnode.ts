import { isArray, isObject, isString, ShapeFlags } from '@mini-dev-vue3/shared'
import { Data } from './component'
import { RendererNode } from './renderer'

export interface VNode<
  HostNode = RendererNode,
  ExtraProps = { [key: string]: any }
> {
  __v_isVNode: boolean
  el: HostNode | null
  key: any
  type: any
  props: (VNodeProps & ExtraProps) | null
  children: any
  component: any
  shapeFlag: number
  patchFlag: number
}

export type VNodeProps = {
  key?: string | number | symbol
}

export const Text = Symbol('Text')

export const Fragment = Symbol('Fragment') as any as {
  __isFragment: true
  new (): {
    $props: VNodeProps
  }
}

export const createVNode = _createVNode as typeof _createVNode

export function _createVNode(
  type: any,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false
): any {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0

  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  )
}

function createBaseVNode(
  type: any,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  shapeFlag = type === Fragment ? 0 : ShapeFlags.ELEMENT,
  isBlockNode = false,
  needFullChildrenNormalization = false
) {
  // 注意 type 有可能是 string 也有可能是对象
  // 如果是对象的话，那么就是用户设置的 options
  // type 为 string 的时候
  // createVNode("div")
  // type 为组件对象的时候
  // createVNode(App)
  const vnode: VNode = {
    __v_isVNode: true,
    el: null,
    key: props?.key,
    type,
    props,
    children,
    component: null,
    shapeFlag,
    patchFlag
  }

  // 基于 children 再次设置 shapeFlag
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children)
  } else if (children) {
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN
  }
  return vnode
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    if (shapeFlag & ShapeFlags.ELEMENT) {
      // slot实现省略
      return
    } else {
      type = ShapeFlags.SLOTS_CHILDREN
    }
  } else {
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.children = children
  vnode.shapeFlag |= type
}

/**
 * @private
 */
export function createTextVNode(text: string = ' ', flag: number = 0): VNode {
  return createVNode(Text, null, text, flag)
}

export function normalizeVNode(child: any): VNode {
  if (isArray(child)) {
    // fragment
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    )
  } else {
    // strings and numbers
    return createVNode(Text, null, String(child))
  }
}
