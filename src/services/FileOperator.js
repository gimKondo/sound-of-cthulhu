const path = require('path')

function extractFileBody (filePath) {
  return path.basename(filePath, path.extname(filePath))
}

export {
  extractFileBody
}
