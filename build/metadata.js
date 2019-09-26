const fs = require('fs')
const path = require('path')

const rootPath = path.dirname(__dirname)
const metadataPath = `${rootPath}/src/metadata`
const distPath = `${rootPath}/dist/main.js`

fs.readFile(metadataPath, 'utf8', (err, metadata) => {
  if (err) throw err

  fs.readFile(distPath, 'utf8', (err, code) => {
    if (err) throw err

    fs.writeFileSync(distPath, metadata + code, { flag: "w+" })
  })
})
