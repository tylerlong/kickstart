/* eslint-env jest */
const fs = require('fs')
const path = require('path')

describe('binary files', () => {
  const logoPath = path.join(__dirname, 'new-project', 'assets', 'logo.png')
  test('should be copied to target directory', () => {
    expect(fs.existsSync(logoPath)).toBe(true)
  })
  test('should be the same as source file', () => {
    const sourcePath = path.join(__dirname, 'boilerplate-project', 'assets', 'logo.png')
    expect(fs.statSync(logoPath).size).toBe(fs.statSync(sourcePath).size)
  })
})
