## mini-dev-vue3

深入学习vue3源代码，基于TypeScript语言开发、Lerna + Monorepo多包管理实现一个mini版的vue3框架
## 思路

基于vue3的功能点，拆分出核心逻辑。  
代码命名、文件目录和源码保持一致，方便结合源码一起阅读，同时方便后期集成vuex、vue-router插件。
## 计划实现功能
#### vue
- [✔️] vue打包入口 区分runtime/full-build构建
#### shared
- [✔️] 工具库，通用方法
#### runtime-dom
- [✔️] 浏览器的runtime，处理原生DOM API
#### runtime-core
- [✔️] 支持组件类型
- [✔️] 支持 element 类型
- [✔️] 初始化 props
- [✔️] setup 可获取 props 和 context
- [✔️] 支持 component emit
- [✔️] 支持 proxy
- [✔️] 可以在 render 函数中获取 setup 返回的对象
- [✔️] nextTick 的实现
- [✔️] 支持 getCurrentInstance
- [✔️] 支持 provide/inject
- [✔️] 支持最基础的 slots
- [✔️] 支持 Text 类型节点
- [✔️] 支持 $el api
#### compiler-core
- [✔️] Parse AST的实现
- [✔️] Transform AST优化
- [✔️] Codegen 生成render函数
#### compiler-dom
- [✔️] compiler 浏览器编译模块
#### reactivity
- [✔️] reactive 的实现
- [✔️] ref 的实现
- [✔️] readonly 的实现
- [✔️] computed 的实现
- [✔️] track 依赖收集
- [✔️] trigger 触发依赖
- [✔️] 支持 isReactive
- [✔️] 支持嵌套 reactive
- [✔️] 支持 toRaw
- [✔️] 支持 effect.scheduler
- [✔️] 支持 effect.stop
- [✔️] 支持 isReadonly
- [✔️] 支持 isProxy
- [✔️] 支持 shallowReadonly
- [✔️] 支持 proxyRefs
### vue3源码思维导图

[Vue3源码思维导图](https://www.processon.com/view/link/6175765c7d9c08459faeddf0#map)  

