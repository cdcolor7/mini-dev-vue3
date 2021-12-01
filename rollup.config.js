import path from 'path'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from "@rollup/plugin-node-resolve";
import ts from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

if(!process.env.TARGET) {
  throw new Error('必须指定打包目标项目！')
}

const packagesDir = path.resolve(__dirname, 'packages') // 解析packages目录
const packageDir =  path.resolve(packagesDir, process.env.TARGET) // 解析打包目录
const resolve = p => path.resolve(packageDir, p) // resole封装
const pkg = require(resolve(`package.json`)) // 获取package信息
const packageOptions = pkg.buildOptions || {} // 获取打包项目的构建信息
const name = packageOptions.filename || path.basename(packageDir)

let hasTSChecked = false  // 确保每次打包只生产一次ts检查

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    name: `Vue`,
    format: `iife`
  },
}

const defaultFormats = ['esm-bundler', 'cjs','global']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split('/')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]))

export default packageConfigs

// 创建rollup配置对象
function createConfig(format, output, plugins = []) {
  if(!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  if(process.env.NODE_ENV === 'production') {
    plugins.push(terser())
  }
  // const shouldEmitDeclarations = pkg.types && process.env.TYPES != null && !hasTSChecked
  const shouldEmitDeclarations = pkg.types && !hasTSChecked
  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations, // 创建类型声明文件
        declarationMap: shouldEmitDeclarations // 指定是否为声明文件.d.ts生成map文件 
      },
      exclude: ['**/__tests__', 'test-dts']
    }
  })
  hasTSChecked = true

  let entryFile = 'lib/index.ts' // 暂时不区分运行时runtime版本
  let external = []
  const extensions = ['.js', '.ts', '.tsx']
  return {
    input: resolve(entryFile),
    output,
    external,
    plugins: [
      json({
        namedExports: false
      }),
      nodeResolve({
        extensions,
        modulesOnly: true
      }),
      tsPlugin,
      babel({
        extensions,
        babelHelpers:'bundled',
        exclude:'node_modules/**' // 只转义自己的源代码
      }),
      ...plugins,
      commonjs()
    ]
  }
}