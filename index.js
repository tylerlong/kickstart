#!/usr/bin/env node
const commander = require('commander')
const path = require('path')
const fs = require('fs')
const R = require('ramda')
const glob = require('globby')
const nunjucks = require('nunjucks')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml')
const isBinaryFile = require('isbinaryfile')

const pkg = require('./package.json')

commander.version(pkg.version)
  .option('-k --kickstartProject <kickstartProject>', 'kickstart project')
  .option('-c --configFile [configFile]', 'config file')
  .option('-o --outputDirectory [outputDirectory]', 'output directory')
  .parse(process.argv)

const kickstartProject = commander.kickstartProject
if (typeof kickstartProject !== 'string') {
  commander.help()
}
if (!fs.existsSync(kickstartProject)) {
  console.error(`'${kickstartProject}' doesn't exist`)
  process.exit(1)
}
nunjucks.configure(kickstartProject, { autoescape: false })

const configFile = commander.configFile || path.join(commander.kickstartProject, 'kickstart.yml')
if (!fs.existsSync(configFile)) {
  console.error(`'${configFile}' doesn't exist`)
  process.exit(1)
}
const defaultConfig = yaml.load(fs.readFileSync(path.join(commander.kickstartProject, 'kickstart.yml'), 'utf-8'))
const config = R.merge(defaultConfig, yaml.load(fs.readFileSync(configFile, 'utf-8')))

const outputDirectory = commander.outputDirectory || '.'
if (fs.existsSync(outputDirectory) && fs.readdirSync(outputDirectory).length > 0) {
  console.error(`Target directory is not empty`)
  process.exit(1)
}

const files = R.reject(item => item === 'kickstart.yml', glob.sync(path.join('**', '*'), {
  cwd: kickstartProject,
  dot: true,
  nodir: true,
  gitignore: true,
  ignore: [
    path.join('.git', '**', '*')
  ]
}))
R.forEach(file => {
  const targetFile = path.join(outputDirectory, file)
  mkdirp.sync(path.dirname(targetFile))
  const sourceFile = path.join(kickstartProject, file)
  if (isBinaryFile.sync(sourceFile)) {
    fs.createReadStream(sourceFile).pipe(fs.createWriteStream(targetFile))
  } else {
    const content = nunjucks.render(file, config)
    fs.writeFileSync(targetFile, content)
  }
})(files)
