const fs = require('fs')
const EventEmitter = require('events').EventEmitter
const filesEE = new EventEmitter()
const styleguideConfig = require('../styleguide.config')
const folderName = styleguideConfig.componentFolderPath
const basePath = ''

const currentBranch = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim()

const currentDiff = require('child_process')
  .execSync('git diff --stat @{1.day.ago}..@{now} --name-only')
  .toString()
  .trim()
  .split('\n')

const fileList = []
let fileCount = 0
let rawVueFileCount = 0

const isNameEqIndex = (name, folder, forPath) => {
  if (name === 'index' && !forPath) {
    return /[^/]*$/.exec(folder)[0]
  }
  if (forPath && name === 'index') {
    return '/'
  }
  return name
}

const getFiles = (basePath, folder) => {
  fs.readdir(basePath + folder, function (err, files) {
    if (err) {
      throw err
    }

    rawVueFileCount += files.filter(elm => /.*\.(vue)/gi.test(elm)).length

    files.forEach(function (file) {
      const isVue = file.match(/(.vue)/)
      const isDirectory = fs.lstatSync(basePath + folder + '/' + file).isDirectory()

      if (isDirectory) {
        getFiles(basePath, folder + '/' + file)
      }

      if (isVue) {
        const fileName = isVue.input
        const withoutExt = fileName.slice(0, fileName.length - 4)
        const fullPath = basePath + folder + '/' + fileName
        const componentType = /[^/]*/.exec(folder)[0]
        let componentPath = folder + '/' + isNameEqIndex(withoutExt, folder, true)
        const currentAuthor = require('child_process')
          .execSync('git log --  ' + fullPath + ' -p -1 | grep  "^Author: " |sort|uniq -c|sort -nr')
          .toString()
          .trim()
          .replace(/Author/g, '')
          .replace(/\s/g, '')
          .replace(':', '')
          .replace(/:/g, ', ')
          .replace(/</g, ' (')
          .replace(/>/g, ' )')
          .replace(new RegExp('[0-9]', 'g'), '')
        const isModified = currentDiff.includes(folder + '/' + fileName)
          ? currentBranch
          : 'master'

        fs.readFile(fullPath, 'utf8', function (err, contents) {
          if (err) {
            throw err
          }

          if (componentPath.endsWith('/')) {
            componentPath = componentPath.slice(0, componentPath.length - 2)
          }

          fileList.push([
            fileCount + 1,
            componentPath,
            componentType,
            isNameEqIndex(withoutExt, folder),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            currentAuthor,
            isModified,
            null,
            null,
            null,
            null
          ])

          fileCount++

          if (rawVueFileCount === fileCount) {
            filesEE.emit('files_ready')
          }
        })
      }
    })
  })

  return fileList
}

function generate() {
  folderName.forEach(function (v, i) {
    const componentEntries = getFiles(basePath, v)
    const isLast = folderName.length - 1 === i
    if (isLast) {
      filesEE.on('files_ready', function () {
        const sortedEntries = componentEntries.sort((a, b) => {
          if (a[3] === b[3]) {
            return 0
          } else {
            return a[3] < b[3] ? -1 : 1
          }
        })
        const jsonObj = JSON.stringify(sortedEntries, null, 4)

        fs.writeFile(styleguideConfig.schemaDataPath, jsonObj, function (
          err
        ) {
          if (err) {
            throw err
          }
        })
      })
    }
  })
}

generate()
