import { RootNode } from './ast'
export interface CodegenResult {
  code: string
  ast: RootNode
}

export function generate(ast: RootNode): CodegenResult {
  /*  可执行js代码生成逻辑 */
  let context = {
    code: 'render code'
  }
  return {
    ast,
    code: context.code
  }
}
