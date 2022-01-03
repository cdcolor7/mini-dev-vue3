import { RendererOptions } from '@mini-dev-vue3/runtime-core'

export const svgNS = 'http://www.w3.org/2000/svg'
const doc = (typeof document !== 'undefined' ? document : null) as Document

export const nodeOps: RendererOptions<Node, Element> = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },

  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },

  createElement: (tag, isSVG, is): Element => {
    const el = isSVG
      ? doc.createElementNS(svgNS, tag)
      : doc.createElement(tag, is ? { is } : undefined)
    return el
  },

  createText: text => doc.createTextNode(text),

  setText: (node, text) => {
    node.nodeValue = text
  },

  setElementText: (el, text) => {
    el.textContent = text
  },

  parentNode: node => node.parentNode as Element | null,

  nextSibling: node => node.nextSibling,

  querySelector: selector => doc.querySelector(selector),

  cloneNode(el) {
    const cloned = el.cloneNode(true)
    if (`_value` in el) {
      ;(cloned as any)._value = (el as any)._value
    }
    return cloned
  }
}
