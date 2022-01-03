export function initProps(instance: any, rawProps: any) {
  // 功能没有实现
  // 涉及 attrs、
  // 如果组件声明了 props 的话，那么才可以进入 props 属性内
  // 不然的话是需要存储在 attrs 内
  // 这里暂时直接赋值给 instance.props 即可
  instance.props = rawProps
}
