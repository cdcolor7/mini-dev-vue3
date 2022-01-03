// import { RenderFunction } from '@mini-dev-vue3/runtime-core'
import { isString, NOOP } from '@mini-dev-vue3/shared'
import { compile } from '@mini-dev-vue3/compiler-dom'
// import * as runtimeDom from '@mini-dev-vue3/runtime-dom'

function compileToFunction(template: string | HTMLElement, options?: any): any {
  // RenderFunction

  if (!isString(template)) {
    if (template.nodeType) {
      template = template.innerHTML
    } else {
      return NOOP
    }
  }

  if (template[0] === '#') {
    const el = document.querySelector(template)
    template = el ? el.innerHTML : ``
  }

  const ret = compile(template)
  // 编译执行结果
  console.log(ret)

  // const render = (
  //   new Function('Vue', code)(runtimeDom)
  // ) as RenderFunction

  // console.log(render);

  // return render
}

// 模板编译 --  仅限开发测试使用
// compileToFunction('#app')

export { compileToFunction as compile }
export * from '@mini-dev-vue3/runtime-dom'
