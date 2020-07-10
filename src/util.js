
const fs = require('fs')

module.exports.getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .reverse()

module.exports.getFilesByEnding = ( source, ending = 'csv' ) => 
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent =>  RegExp( ending + '$' ).test(dirent.name) )
    .map(dirent => dirent.name)
    .reverse()