/* eslint-env jest */
const fs = require('fs')
const path = require('path')
const glob = require('globby')
const R = require('ramda')
const isBinaryFile = require('isbinaryfile')

const sourceDir = path.join(__dirname, 'kickstart-project')
const targetDir = path.join(__dirname, 'new-project')

const sourceFiles = R.pipe(
  R.reject(item => item === 'kickstart.yml'),
  R.reject(item => R.contains('{{', item) || R.contains('{%', item) || R.contains('{#', item)),
  R.sortBy(R.identity)
)(glob.sync(path.join('**', '*'), { cwd: sourceDir,
  dot: true,
  nodir: true,
  gitignore: true,
  ignore: [ path.join('**', '.git', '**', '*') ]
}))
const targetFiles = R.sortBy(R.identity)(
  glob.sync(path.join('**', '*'), { cwd: targetDir, dot: true, nodir: true, gitignore: false })
)

describe('directory structure', () => {
  test('should equal source', () => { // sourceFiles is a subset of targetFiles
    expect(R.difference(sourceFiles, targetFiles).length).toBe(0)
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
  "name": "my-app",
  "version": "0.1.0",
  "license": "MIT"
}
`.trim())
  })
})
