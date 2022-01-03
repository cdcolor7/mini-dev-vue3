import { createVNode } from './vnode'

export const h = (type: string, propsOrChildren?: any, children?: any) => {
  return createVNode(type, propsOrChildren, children);
};
