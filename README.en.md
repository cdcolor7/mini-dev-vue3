# mini-dev-vue3

### 介绍
深入学习vue3源代码，基于TypeScript语言开发、lerna + monorepo多包管理实现一个mini版的vue3框架。

### 安装依赖
npm 不支持 workspaces，安装依赖必须使用 yarn 安装依赖
``` bash
yarn # 必须
```

### 开发
测试范例文档目录：./packages/vue/examples/
``` bash
yarn dev <name> -s  # '<name>打包目标[为空默认vue,]'; -s '是否开启souceMap'
```
### 启动docs
vue3源码详细说明文档、lerna、pnpm、rollup相关使用说明。
``` bash
yarn doc:dev
```

### 测试
``` bash
yarn test
```

### 构建
构建输出文件目录：./packages/*/dist/
``` bash
yarn build <name>  # '<name>构建目标[为空默认全部]'
```

### 功能实现
#### vue
- [✔️] vue打包入口 区分runtime/full-build构建
#### reactivity
- [✔️] reactive 的实现
- [✔️] ref 的实现
- [✔️] readonly 的实现
- [✔️] 支持 isReactive
- [✔️] 支持嵌套 reactive
- [✔️] 支持 toRaw
- [✔️] 支持 unref
- [✔️] 支持 toRef
- [✔️] 支持 toRefs
- [✔️] 支持 isReadonly
- [✔️] 支持 isProxy
- [✔️] 支持 shallowReadonly
- [✔️] 支持 proxyRefs
- [✔️] track 依赖收集
- [✔️] trigger 触发依赖
- [✔️] 支持 effect.stop
- [✖️] 支持 effect.scheduler
- [✖️] computed 的实现
#### shared
- [✔️] 工具库，通用方法
#### runtime-dom
- [✔️] 浏览器的runtime，处理原生DOM API
#### runtime-core
- [✖️] 支持组件类型
- [✖️] 支持 element 类型
- [✖️] 初始化 props
- [✖️] setup 可获取 props 和 context
- [✖️] 支持 component emit
- [✖️] 支持 proxy
- [✖️] 可以在 render 函数中获取 setup 返回的对象
- [✖️] nextTick 的实现
- [✖️] 支持 getCurrentInstance
- [✖️] 支持 provide/inject
- [✖️] 支持最基础的 slots
- [✖️] 支持 Text 类型节点
- [✖️] 支持 $el api
#### compiler-core
- [✔️] Parse AST的实现
- [✔️] Transform AST优化
- [✖️] Codegen 生成render函数
#### compiler-dom
- [✖️] compiler 浏览器编译模块
### vue3源码思维导图
[Vue3源码思维导图](https://www.processon.com/view/link/6175765c7d9c08459faeddf0#map)  
