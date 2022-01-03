## 介绍
Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码。
## 配置文件

Rollup的配置文件是可选的，但是使用配置文件的作用很强大，而且很方便，因此我们推荐你使用  
配置文件是一个ES6模块，它对外暴露一个对象，这个对象包含了一些Rollup需要的一些选项。  
通常，我们把这个配置文件叫做rollup.config.js，它通常位于项目的根目录  

``` javascript
// rollup.config.js
export default {
  input,     // 必须
  plugins,
  output: {  // 必须 (如果要输出多个，可以是一个数组)
    file,    // 必须
    format,  // 必须 g格式：amd, cjs, esm, iife, umd
    name,    // umd iife 必须定于全局变量名称
    sourcemap
  },
  external
};
```
## 命令行
``` bash
 # 默认使用rollup.config.js
rollup --config

 # 或者, 使用自定义的配置文件，这里使用my.config.js作为配置文件
rollup --config my.config.js
```

## 基本插件（必备）
你必须使用配置文件才能执行以下操作：  

把一个项目打包，然后输出多个文件  
- @rollup/plugin-node-resolve 插件可以解决 ES6模块的查找导入。  
- @rollup/plugin-commonjs 但是npm中的大多数包都是以CommonJS模块的形式出现的，所以需要使用这个插件将CommonJS模块转换为 ES2015 供 Rollup 处理。  
- @rollup/plugin-json rollup默认只解析js文件 导入json需要引入相关插件

``` javascript
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  // commonjs 需要放到 transform 插件之前，
  // 但是又个例外， 是需要放到 babel 之后的
  plugins: [
    json(),
    resolve(), 
    commonjs()
  ]
}
```
## 整合typescript
``` bash
yarn add -D -W rollup-plugin-typescript2  # ts转换
yarn add -D -W typescript  # ts解析器

./node_modules/.bin/tsc --init
```
``` javascript
import ts from "rollup-plugin-typescript2";
const extensions = [
  '.js',
  '.ts',
  '.tsx'
]
export default {
  plugins: [
    ts({
      tsconfig: path.resolve(__dirname, './tsconfig.json'), // 导入本地ts配置
      extensions
    }),
  ]
}
```
## Babel
Babel 是一个 JavaScript 编译器
- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 （通过引入第三方 polyfill 模块，例如 core-js）
- 源码转换
``` bash
yarn add  -W -D @rollup/plugin-babel @babel/core
yarn add  -W @babel/polyfill
```
``` js
import babel from '@rollup/plugin-babel';

export default {
  plugins: [
    ts(),
    terser(),
    babel({
       babelHelpers: 'bundled' 
    })
  ]
}
```
## 配置.babelrc配置文件
安装Preset部门 -D  
- @babel/preset-env : 编译js语法;  
- @babel/preset-react ：编译react语法 JSX;  
- @babel/preset-typescript： 编译ts语法;   
- @babel/preset-flow： 编译flow语法;  
``` bash
yarn add  -W -D @babel/preset-env @babel/preset-typescript
```

``` json
{
  "presets": [["@babel/preset-env", {
    "targets":  ["last 2 versions","> 1%"], // 目标浏览器集合
    "corejs":2, // corejs的版本
    "useBuiltIns": "usage" // 按需加载
  }],
  ["@babel/preset-typescript"]
  ]
}
```
## 其他插件（扩展）

- rollup-plugin-terser 代码压缩  
- @rollup/plugin-replace 替换文件中的目标字符串


``` javascript
import terser from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";

export default {
  plugins: [
    terser(),
    replace({
      __DEV__: true,
      __COMMIT__: true,
      __BROWSER__: true,
    })
  ]
}
```
## tsconfig的配置
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "sourceMap": false,
    "target": "es2016",
    "module": "esnext",
    "rootDir": ".", 
    "esModuleInterop": true,
    "moduleResolution": "node",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "allowJs": false,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "paths":{
      "@mini-dev-vue3/*": ["packages/*/lib"]
    }
  }
}
```
- target: 编译目标  
- module: 制定编译模块  
- rootDir：编译文件根目录  
- baseUrl：设置解析非相对模块名称的基本目录  
- esModuleInterop：通过为导入内容创建命名空间  
- moduleResolution：用于选择模块解析  
- allowJs：用来指定是否允许编译js文件，默认是false，即不编译js文件  
- experimentalDecorators： 启用装饰器  
- paths: 用于设置模块名称到基于baseUrl的路径映射（配置paths字段，这样开发的时候ts才不会报找不到包的错）。

