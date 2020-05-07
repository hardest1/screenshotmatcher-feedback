
const fs = require('fs')
const config = require('../config')

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .reverse()
  
module.exports = async (req, res) => {

  const feedbacks = []

  const dirList = getDirectories(config.FEEDBACK_DIR)
  
  dirList.forEach(c => {
    const infoJson = fs.readFileSync(config.FEEDBACK_DIR + '/' + c + '/info.json', 'utf-8');
    const infoData = JSON.parse(infoJson);
    const newFb = { dir: c, infoData }
    feedbacks.push(newFb)
  })
  
  
  res.render('dashboard', { feedbacks });

}