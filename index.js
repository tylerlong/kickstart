#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs')
const R = require('ramda')
const glob = require('glob')
const nunjucks = require('nunjucks')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml')

const pkg = require('./package.json')

commander.version(pkg.version)
  .option('-b --boilerplateProject <boilerplateProject>', 'boilerplate project')
  .option('-c --configFile [configFile]', 'config file')
  .option('-o --outputDirectory [outputDirectory]', 'output directory')
  .parse(process.argv)

const boilerplateProject = commander.boilerplateProject
if (typeof boilerplateProject !== 'string') {
  commander.help()
}
if (!fs.existsSync(boilerplateProject)) {
  console.error(`'${boilerplateProject}' doesn't exist`)
  process.exit(1)
}
nunjucks.configure(boilerplateProject, { autoescape: false })

const configFile = commander.configFile || path.join(commander.boilerplateProject, 'kickstart.yml')
if (!fs.existsSync(configFile)) {
  console.error(`'${configFile}' doesn't exist`)
  process.exit(1)
}
const config = yaml.load(fs.readFileSync(configFile, 'utf-8'))

const outputDirectory = commander.outputDirectory || '.'
if (!fs.existsSync(outputDirectory)) {
  console.error(`'${outputDirectory}' doesn't exist`)
  process.exit(1)
}

if (fs.readdirSync(outputDirectory).length > 0) {
  console.error(`Target directory is not empty`)
  process.exit(1)
}

const files = R.concat(
  glob.sync(path.join('**', '.*'), { cwd: boilerplateProject }),
  glob.sync(path.join('**', '*.*'), { cwd: boilerplateProject })
)

R.forEach(file => {
  const content = nunjucks.render(file, config)
  const targetFile = path.join(outputDirectory, file)
  mkdirp(path.dirname(targetFile), err => {
    if (err) { throw err }
    fs.writeFileSync(targetFile, content)
  })
})(files)
