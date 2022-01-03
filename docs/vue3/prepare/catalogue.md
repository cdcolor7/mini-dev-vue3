## 源码结构
源码重点关注packages目录,主体结构如下：
``` js
├── packages
    ├── compiler-core // 平台无关的编译器核心代码. 它既包含可扩展的基础功能，也包含所有平台无关的插件。
    ├── compiler-dom  // 针对浏览器的编译器模块
    ├── compiler-sfc  // 单文件编译部分
    ├── compiler-ssr  // 服务端渲染编译
    ├── global.d.ts   // 全局声明文件
    ├── reactivity    // 响应式系统，可以和任何框架搭配使用，使用proxy
    ├── runtime-core  // 与平台无关的运行时虚拟DOM渲染器，vue组件和各种API。可针对某个具体平台实现高阶runtime，比如自定义渲染器
    ├── runtime-dom   // 针对浏览器的 runtime。其功能包括处理原生 DOM API、DOM 事件和 DOM 属性等。
    ├── runtime-test  // 一个专门为了测试而写的轻量级 runtime。
    ├── server-rendere // 服务器端渲染
    ├── shared         // 内部工具库
    ├── size-check     // 测试代码体积大小
    ├── template-explorer   // 调试编译器输出的开发工具
    └── vue                 // 用于构建vue「完整构建」版本, 引用了运行时和编译器
├── scripts // 脚本文件，包含配置文件，进行编译和打包
├── test-dts // 测试文件
├── .eslintrc.js
├── .prettierrc
├── api-extractor.json // 所有包的共享基本配置文件，TypeScript 的API提取和分析工具
├── jest.config.js
├── package.json
├── rollup.config.js // rollup配置文件
├── tsconfig.json
└── pnpm-workspace.yaml // pnpm workspace配置文件
```
- LICENSE —— 开源协议，MIT 协议可能是几大开源协议中最宽松的一个，核心条款是：
该软件及其相关文档对所有人免费，可以任意处置，包括使用，复制，修改，合并，发表，分发，再授权，或者销售。唯一的限制是，软件中必须包含上述版 权和许可提示。
- api-extractor.json —— 所有包共享的配置文件。当我们 src 下有多个文件时，打包后会生成多个声明文件。使用 @microsoft/api-extractor 这个库是为了把所有的 .d.ts 合成一个，并且，还是可以根据写的注释自动生成文档。
- template-explorer: 用于调试编译器输出的开发工具。您可以运行npm run dev dev template-explorer并打开它index.html以获取基于当前源代码的模板编译的副本。在线编译网址：[vue-next-template-explorer.netlify.app](https://vue-next-template-explorer.netlify.app/#)
## Runtime & Compile
通过结构我们可以看到 package 中最重要的模块有5个，分别为

- compiler-core
- compiler-dom
- runtime-core
- runtime-dom
- reactivity  

> compile我们可以理解为程序编绎时，是指我们写好的源代码在被编译成为目标文件这段时间，但我们可以通俗的看成是我们写好的源代码在被转换成为最终可执行的文件这段时间，在这里可以理解为我们将.vue文件编绎成浏览器能识别的.html文件的一些工作，  
 
> runtime 可以理解为程序运行时，即是程序被编译了之后，打开程序并运行它直到程序关闭的这段时间的系列处理  

#模块关系图
## 模块关系图

```js
                      +---------------------+    +----------------------+
                      |                     |    |                      |
        +------------>|  @vue/compiler-dom  +--->|  @vue/compiler-core  |
        |             |                     |    |                      |
   +----+----+        +---------------------+    +----------------------+
   |         |
   |   vue   |
   |         |
   +----+----+        +---------------------+    +----------------------+    +-------------------+
        |             |                     |    |                      |    |                   |
        +------------>|  @vue/runtime-dom   +--->|  @vue/runtime-core   +--->|  @vue/reactivity  |
                      |                     |    |                      |    |                   |
                      +---------------------+    +----------------------+    +-------------------+
```
## 总结
Vue3 的目录结构还是特别清晰的，这里简单标记了一下各文件夹的功能和结构，后面文章开始详细解析 Vue3 的源码。