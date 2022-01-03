# 源码构建
Vue3 源码采用monorepo管理模式，通过[pnpm](/lerna/pnmp.html)进行多包管理，达到了在一个repo 中高效便捷地管理多个package的目,可以批量构建所有package包，也可以单独制定构建目标。  
  
Vue3 源码是基于 [Rollup](/rollup/info.html) 构建的，它的构建脚本文件都在 scripts 目录下。

## 构建脚本
通常一个基于 NPM 托管的项目都会有一个 package.json 文件，它是对项目的描述文件，它的内容实际上是一个标准的 JSON 对象。  
我们通常会配置 script 字段作为 pnpm 的执行脚本，Vue3.js 源码构建的脚本命令如下：
```json
"scripts": {
    "dev": "node scripts/dev.js",
    "build": "node scripts/build.js",
    "release": "node scripts/release.js",
    "dev-compiler": "run-p \"dev template-explorer\" serve",
  }
```
> 这里我保留了4条命令，作用如下：  
> > dev:  开发调试，一次调试一个package，默认：vue  
> > build:  代码构建，默认packages所有项目，可以指定具体构建目标[单个或者多个]  
> > release:  发布公共库  
> > dev-compiler: 开启浏览器调试
## 构建过程
基于源码分析构建过程，在 scripts/build.js 中：
``` js
const { targets: allTargets, fuzzyMatchTarget } = require('./utils') // 获取系统所有的打包目标
const args = require('minimist')(process.argv.slice(2)) // 获取命令行参数
const targets = args._ // 获取命令行传入打包目标集合
const formats = args.formats || args.f  // 获取命令行传入的打包 格式
const sourceMap = args.sourcemap || args.s // sourceMap开启打包代码和源代码的映射
const isRelease = args.release // 是否发布
const buildAllMatching = args.all || args.a // 是否构建所有package
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7) // git校验
// ...
// 执行rollup打包命令
async function build(target) 
  // ...
  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        formats ? `FORMATS:${formats}` : ``,
        buildTypes ? `TYPES:true` : ``,
        prodOnly ? `PROD_ONLY:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``
      ]
        .filter(Boolean)
        .join(',')
    ],
    { stdio: 'inherit' }
  )
  // 合并所有d.ts声明文件
  if (buildTypes && pkg.types) {
    // ...
    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')
    const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true
    })
    if (extractorResult.succeeded) {
      const typesDir = path.resolve(pkgDir, 'types')
      if (await fs.exists(typesDir)) {
        const dtsPath = path.resolve(pkgDir, pkg.types)
        const existing = await fs.readFile(dtsPath, 'utf-8')
        const typeFiles = await fs.readdir(typesDir)
        const toAdd = await Promise.all(
          typeFiles.map(file => {
            return fs.readFile(path.resolve(typesDir, file), 'utf-8')
          })
        )
        await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
      }
      // ...
    } else {
      // ...
      process.exitCode = 1
    }
  }
}
```
这段代码逻辑还是比较清晰，通过命令行参数对构建配置做过滤，在和packages项目进行匹配，这样就可以生成“**不同格式/不同项目**”的rollup打包命令，然后通过execa执行。  
接下来我们看一下rollup配置文件，在 rollup.config.js 中：
``` js
const masterVersion = require('./package.json').version // 获取项目版本
const packagesDir = path.resolve(__dirname, 'packages') // 解析packages目录
const packageDir = path.resolve(packagesDir, process.env.TARGET) // 解析打包目标
const pkg = require(resolve(`package.json`)) // 获取打包目标package.json信息
const packageOptions = pkg.buildOptions || {} // 打包目标的构建选项

const outputConfigs = { // vue3可以输出的文件格式的集合
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },
  // runtime-only builds, for main "vue" package only
  'esm-bundler-runtime': {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`
  },
  'esm-browser-runtime': {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: 'es'
  },
  'global-runtime': {
    file: resolve(`dist/${name}.runtime.global.js`),
    format: 'iife'
  }
}
// ...
// 确定打包文件格式集合
const defaultFormats = ['esm-bundler', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats

// ...
// 输出rollup打包配置文件
export default packageConfigs

// cjs iife es的dev版本
function createConfig(format, output, plugins = []) {
  // ...
}
// cjs 的生产环境版本
function createProductionConfig(format, output, plugins = []) {
  // ...
}
// iife es的生产环境版本 启用代码压缩
function createMinifiedConfig(format, output, plugins = []) {
  // ...
}
```
## 总结
通过这一节的分析，我们可以了解到 Vue3 的构建打包过程，也知道了不同作用和功能的 package 它们对应的入口以及最终编译生成的 JS 文件。Vue3实际开发项目，尽管我们会用 [Runtime Only](/vue3/prepare/entrance.html#runtime-only-vs-runtime-compiler) 版本开发比较多，但为了分析 Vue3 的编译过程，解析我们重点分析的源码是 Runtime + Compiler 的 Vue3.js。