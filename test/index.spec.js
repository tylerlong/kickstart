/* eslint-env jest */
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const R = require('ramda')
const isBinaryFile = require('isbinaryfile')

const sourceDir = path.join(__dirname, 'boilerplate-project')
const targetDir = path.join(__dirname, 'new-project')

const sourceFiles = R.pipe(
  R.reject(item => item === 'kickstart.yml'),
  R.sortBy(R.identity)
)(glob.sync(path.join('**', '*'), { cwd: sourceDir, dot: true, nodir: true }))
const targetFiles = R.sortBy(R.identity)(
  glob.sync(path.join('**', '*'), { cwd: targetDir, dot: true, nodir: true })
)

describe('directory structure', () => {
  test('should equal source', () => {
    expect(targetFiles).toEqual(sourceFiles)
  })
})

describe('binary file', () => {
  test('should equal source', () => {
    R.forEach(filename => {
      if (isBinaryFile.sync(path.join(sourceDir, filename))) {
        expect(fs.readFileSync(path.join(targetDir, filename)).toString())
          .toEqual(fs.readFileSync(path.join(sourceDir, filename)).toString())
      }
    })(sourceFiles)
  })
})

describe('static file', () => {
  test('should equal source', () => {
    R.forEach(filename => {
      if (!isBinaryFile.sync(path.join(sourceDir, filename))) {
        const sourceContent = fs.readFileSync(path.join(sourceDir, filename), 'utf-8')
        if (sourceContent.indexOf('{{') === -1 && sourceContent.indexOf('{%') === -1 && sourceContent.indexOf('{#') === -1) {
          const targetContent = fs.readFileSync(path.join(targetDir, filename), 'utf-8')
          expect(targetContent).toEqual(sourceContent)
        }
      }
    })(sourceFiles)
  })
})

describe('dynamic file', () => {
  test('package.json', () => {
    expect(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8').trim()).toEqual(`
{
  "name": "cool-project",
  "version": "0.2.0",
  "license": "MIT"
}
`.trim())
  })
})
