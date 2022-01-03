import {
  baseCompile
  // baseParse,
  // CompilerOptions,
  // CodegenResult,
  // ParserOptions,
  // RootNode,
  // noopDirectiveTransform,
  // NodeTransform,
  // DirectiveTransform
} from '@mini-dev-vue3/compiler-core'

// 编译器函数
export function compile(template: string): any {
  return baseCompile(template)
}

export * from '@mini-dev-vue3/compiler-core'
