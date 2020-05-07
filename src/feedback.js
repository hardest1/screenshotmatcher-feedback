const fs = require('fs');
const moment = require('moment');
const config = require('../config');

const getEndingByMimeType = (mime) => {
  switch(mime){
    case 'image/jpeg':
      return 'jpg';
    default:
      return 'png';
  }
}

module.exports = async (req, res) => {

  // exit if wrong secret provided
  if(req.body.secret !== config.SECRET) return res.sendStatus(401);

  // get data from form
  let message = req.body.message || 'N/A';
  let userComment = req.body.comment || 'N/A';
  let deviceInfo = req.body.device || 'N/A';
  let algorithm = req.body.algorithm || 'N/A';
  let photo = req.files.photo || null;
  let screenshot = req.files.screenshot || null;
  let result = req.files.result || null;

  // calc dirname with current time
  const newDirname = config.FEEDBACK_DIR + '/feedback_' + moment().format('DD.MM.YY_HH-mm-ss_SSS')

  // create result dir
  if (!fs.existsSync(newDirname)){
    fs.mkdirSync(newDirname);
  }

  // populate info json data

  const infoData = {
    message,
    userComment,
    deviceInfo,
    algorithm,
    time: moment().format('DD.MM.YY HH:mm:ss'),
  }

  // save images to new directory

  if(photo){
    const photoFile = 'photo.' + getEndingByMimeType(photo.mimetype)
    infoData.photoFile = photoFile
    photo.mv( newDirname + '/' + photoFile, (err) => {
      if(err)
        console.error(err.message || err)
    });
  }

  if(screenshot){
    const screenshotFile = 'screenshot.' + getEndingByMimeType(screenshot.mimetype)
    infoData.screenshotFile = screenshotFile
    screenshot.mv( newDirname + '/' + screenshotFile, (err) => {
      if(err)
        console.error(err.message || err)
    });
  }

  if(result){
    const resultFile = 'result.' + getEndingByMimeType(result.mimetype)
    infoData.resultFile = resultFile
    result.mv( newDirname + '/' + resultFile, (err) => {
      if(err)
        console.error(err.message || err)
    });
  }

  // create info file
  fs.appendFileSync(newDirname + '/info.json', JSON.stringify(infoData))
  
  res.sendStatus(200)

}