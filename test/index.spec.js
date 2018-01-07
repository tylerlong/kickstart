/* eslint-env jest */
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const R = require('ramda')

const sourceDir = path.join(__dirname, 'boilerplate-project')
const targetDir = path.join(__dirname, 'new-project')

describe('binary files', () => {
  const logoPath = path.join(targetDir, 'assets', 'logo.png')
  test('should be copied to target directory', () => {
    expect(fs.existsSync(logoPath)).toBe(true)
  })
  test('should be the same as source file', () => {
    const sourcePath = path.join(sourceDir, 'assets', 'logo.png')
    expect(fs.statSync(logoPath).size).toBe(fs.statSync(sourcePath).size)
  })
})

describe('directory structure', () => {
  test('should equal source', () => {
    let sourceFiles = glob.sync(path.join('**', '*'), { cwd: sourceDir, dot: true, nodir: true })
    sourceFiles = R.pipe(
      R.reject(item => item === 'kickstart.yml'),
      R.sortBy(R.identity)
    )(sourceFiles)
    let targetFiles = glob.sync(path.join('**', '*'), { cwd: targetDir, dot: true, nodir: true })
    targetFiles = R.sortBy(R.identity)(targetFiles)
    expect(targetFiles).toEqual(sourceFiles)
  })
})
