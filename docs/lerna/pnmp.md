## 介绍
> 本质上他是一个包管理工具，和npm/yarn没有区别，主要优势在于
> 1. 包安装速度极快  
> 2. 磁盘空间利用效率高  
> 3. 支持monorepo  
> 4. 安全
>> 之前在使用 npm/yarn 的时候，由于 node_module 的扁平结构，如果 A 依赖 B， B 依赖 C，那么 A 当中是可以直接使用 C 的，但问题是 A 当中并没有声明 C 这个依赖。因此会出现这种非法访问的情况。 但 pnpm 自创了一套依赖管理方式，很好地解决了这个问题，保证了安全性。
## 项目初始化
``` bash
npm i -g pnpm  # 全局安装pnmp
pnpm init -y # 初始化下面项目
```
步骤1： 在packages中新建子项目文件夹，并且初始化   
步骤2： 在root目录新建pnpm-workspace.yaml，内容如下
```yaml
packages:
  - 'packages/**'
```
## 依赖管理
``` bash
pnpm i 包名 -D/-S -W # root目录新增依赖
pnpm i 包名 -D/-S --filter 子项目名称 # 新增子项目依赖 可以使用使用通配符 * 
pnpm update 包名 # 更新
pnpm uninstall 包名 # 删除
pnpm link ../../axios #硬链接
```