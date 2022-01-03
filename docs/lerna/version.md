## 介绍
> 1.0.0-0  
> 主版本号(major).次版本号(minor).修订号(patch)-预发布号(release)  
> 优先级以此递减，每次修改前面版本号都会影响后面版本号，所以谨慎操作  
##  版本信息
``` bash
npm version
```
```js
{ 
  'npm-version-test': '1.0.0',
  npm: '6.4.1',
  ares: '1.14.0',
  cldr: '33.1',
  http_parser: '2.8.0',
  icu: '62.1',
  modules: '64',
  napi: '3',
  nghttp2: '1.33.0',
  node: '10.10.0',
  openssl: '1.1.0i',
  tz: '2018e',
  unicode: '11.0',
  uv: '1.23.0',
  v8: '6.8.275.30-node.24',
  zlib: '1.2.11'
}
```
## 常见命令
### prerelease
```bash
# 升级预发布号
npm version prerelease
# 执行一次 版本号1.0.0变为 1.0.0-0
# 在执行一次 版本号1.0.0-0变为 1.0.0-1
# 备注
#  1. 如果没有预发布号，则增加prerelease 设为0；
#  2. 如果有prerelease， 则prerelease 增加1。
```
### prepatch
``` bash
# 升级修订号，保留预发布号
npm version prepatch
# 版本号1.0.1-1变为 1.0.2-0
# 版本号3.0.0–>3.0.1-0
# 备注
# prepatch - 直接升级小号，增加预发布号为0。
```
### preminor
``` bash
# 升级次版本号，保留预发布号
npm version preminor
# 版本号1.0.2-0变为 1.1.0-0
# 备注
# preminor - 直接升级中号，小号置为0，增加预发布号为0。
```
### premajor
``` bash
# 升级主版本号，保留预发布号 
npm version premajor
# 版本号 1.1.0-0变为 2.0.0-0
# 版本号 2.1.0–> 3.0.0-0;
# 版本号 4.0.0 --> 5.0.0-0
# 备注
# premajor - 直接升级大号，中号、小号置为0，增加预发布号为0。
```
### patch
``` bash
# 升级修订号
npm version patch
# 执行一次 版本号2.0.0-0变为 2.0.0
# 在执行一次 版本号2.0.0变为 2.0.1
# 备注
#  1. 如果有prerelease ，则去掉prerelease ，其他保持不变；
#  2. 如果没有prerelease ，则升级修订号.
```
### minor
``` bash
# 升级次版本号
npm version minor
# 版本号2.0.1变为 2.1.0
# 版本号3.0.0-0–> 3.0.0
# 版本号3.0.1-0–>3.1.0
# 备注
# 1. 如果有prerelease， 首先需要去掉prerelease；如果patch为0，则不升级minor
# 2. 如果patch不为0， 则升级minor，同时patch设为0
```
### major
``` bash
# 升级主版本号
npm version major 
# 版本号3.1.0 -->4.0.0
# 版本号4.0.0 --> 5.0.0-0
# 版本号5.1.0-0 -->6.0.0
# 备注
# 1. 如果没有prelease，则直接升级major，其他位都置为0；
# 2. 如果有预发布号： minor和patch都为0，则不升级major，只将prerelease 去掉。
# 3. 如果有预发布号：且minor和patch有任意一个不是0，则升级一位major，其他位都置为0，并去掉prerelease。
```










