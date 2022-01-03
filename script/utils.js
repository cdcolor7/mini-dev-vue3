const fs = require('fs')
const chalk = require('chalk')

const targets = fs.readdirSync('packages').filter(f => {

   // 判断子项目目录 && 且为文件夹
  if(!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }

  // 判断package文件是否存在
  const pkgDir = `packages/${f}/package.json`
  if(!fs.existsSync(pkgDir)) {
    return false
  }

  // 私有子项目不打包
  const pkg = require(`../${pkgDir}`)
  if(pkg.private && !pkg.buildOptions) {
    return false
  }

  return true

})

// 判断匹配的打包目标
function fuzzyMatchTarget(partialTargets, includeAllMatching) {
  const matched = []
  partialTargets.forEach(partialTarget => {
    for (const target of targets) {
      if(target.match(partialTarget)) {
        matched.push(target)
        if(!includeAllMatching) {
          break
        }
      }
    }
  })
  if(matched.length) {
    return matched
  } else {
    console.log()
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`
      )}`
    )
    console.log()

    process.exit(1)
  }
}

module.exports = {
  targets,
  fuzzyMatchTarget
}