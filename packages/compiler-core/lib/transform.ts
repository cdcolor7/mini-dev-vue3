import { isArray, isString } from '@mini-dev-vue3/shared'
import { ExpressionNode, NodeTypes, RootNode } from './ast'
import { TO_DISPLAY_STRING, CREATE_COMMENT } from './runtimeHelpers'
export interface ImportItem {
  exp: string | ExpressionNode
  path: string
}

export function transform(root: RootNode, options: any = {}) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  // if (options.hoistStatic) {
  //   hoistStatic(root, context)
  // }
  if (!options.ssr) {
    // createRootCodegen(root, context)
  }
  // finalize meta information
  root.helpers = [...context.helpers.keys()]
  root.components = [...context.components]
  root.hoists = context.hoists
}

// function createRootCodegen(root: RootNode, context: any) {
//   const { helper } = context
//   const { children } = root
//   if (children.length === 1) {
//     const child = children[0]
//     // if the single child is an element, turn it into a block.
//     if (isSingleElementRoot(root, child) && child.codegenNode) {
//       // single element root is never hoisted so codegenNode will never be
//       // SimpleExpressionNode
//       const codegenNode = child.codegenNode
//       if (codegenNode.type === NodeTypes.VNODE_CALL) {
//         makeBlock(codegenNode, context)
//       }
//       root.codegenNode = codegenNode
//     } else {
//       // - single <slot/>, IfNode, ForNode: already blocks.
//       // - single text node: always patched.
//       // root codegen falls through via genNode()
//       root.codegenNode = child
//     }
//   } else if (children.length > 1) {
//     // root has multiple nodes - return a fragment block.
//     let patchFlag = PatchFlags.STABLE_FRAGMENT
//     let patchFlagText = PatchFlagNames[PatchFlags.STABLE_FRAGMENT]
//     // check if the fragment actually contains a single valid child with
//     // the rest being comments
//     if (
//       __DEV__ &&
//       children.filter(c => c.type !== NodeTypes.COMMENT).length === 1
//     ) {
//       patchFlag |= PatchFlags.DEV_ROOT_FRAGMENT
//       patchFlagText += `, ${PatchFlagNames[PatchFlags.DEV_ROOT_FRAGMENT]}`
//     }
//     root.codegenNode = createVNodeCall(
//       context,
//       helper(FRAGMENT),
//       undefined,
//       root.children,
//       patchFlag + (__DEV__ ? ` /* ${patchFlagText} */` : ``),
//       undefined,
//       undefined,
//       true,
//       undefined,
//       false /* isComponent */
//     )
//   } else {
//     // no children = noop. codegen will return null.
//   }
// }

function createTransformContext(root: RootNode, options: any): any {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    components: new Set(),
    directives: new Set(),
    hoists: [],
    imports: [],
    helper(name: any) {
      const count = context.helpers.get(name) || 0
      context.helpers.set(name, count + 1)
    }
  }

  return context
}

export function traverseNode(node: any, context: any) {
  context.currentNode = node
  // apply transform plugins
  const { nodeTransforms } = context
  const exitFns = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    const onExit = nodeTransforms[i](node, context)
    if (onExit) {
      if (isArray(onExit)) {
        exitFns.push(...onExit)
      } else {
        exitFns.push(onExit)
      }
    }
    if (!context.currentNode) {
      // node was removed
      return
    } else {
      // node may have been replaced
      node = context.currentNode
    }
  }

  switch (node.type) {
    case NodeTypes.COMMENT:
      if (!context.ssr) {
        // inject import for the Comment symbol, which is needed for creating
        // commentimport { RootNode } from '@mini-dev-vue3/compiler-dom';
        context.helper(CREATE_COMMENT)
      }
      break
    case NodeTypes.INTERPOLATION:
      // no need to traverse, but we need to inject toString helper
      if (!context.ssr) {
        context.helper(TO_DISPLAY_STRING)
      }
      break

    // for container types, further traverse downwards
    case NodeTypes.IF:
      for (let i = 0; i < node.branches.length; i++) {
        traverseNode(node.branches[i], context)
      }
      break
    case NodeTypes.IF_BRANCH:
    case NodeTypes.FOR:
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      traverseChildren(node, context)
      break
  }

  // exit transforms
  context.currentNode = node
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

export function traverseChildren(parent: ParentNode, context: any) {
  let i = 0
  const nodeRemoved = () => {
    i--
  }
  for (; i < parent.children.length; i++) {
    const child = parent.children[i]
    if (isString(child)) continue
    context.parent = parent
    context.childIndex = i
    context.onNodeRemoved = nodeRemoved
    traverseNode(child, context)
  }
}
