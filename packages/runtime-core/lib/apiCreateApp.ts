import { RootRenderFunction } from './renderer'
import { createVNode } from "./vnode";


export type CreateAppFunction<HostElement> = (
  rootComponent: any,
) => any

export function createAppAPI<HostElement>(
  render: RootRenderFunction,
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        console.log("基于根组件创建 vnode");
        const vnode = createVNode(rootComponent);
        console.log("调用 render，基于 vnode 进行开箱");
        render(vnode, rootContainer);
      },
    };
    return app;
  }
}

