const fs = require('fs');
const sha1 = require('sha1');
const moment = require('moment');
const config = require('../config');


module.exports = async (req, res) => {

  // exit if wrong secret provided
  if(req.body.secret !== config.SECRET) return res.sendStatus(401);


  let identifier = req.body.identifier || false;

  // exit if no identifier provided
  if(!identifier) return res.sendStatus(400);

  const ipAddrRaw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ipAddr = ipAddrRaw.split(':').slice(-1)[0]

  // get data
  let algorithm = req.body.algorithm || 'N/A';
  let speed = req.body.speed || 'N/A';
  let deviceInfo = req.body.device || 'N/A';
  let hasResult = req.body.hasResult || false;

  let identifierHashed = sha1(identifier)

  // calc filename with current time
  const newFilename = config.LOG_DIR + '/log_' + identifierHashed + '.csv'

  const logData = [
    moment().format('DD.MM.YY HH:mm:ss'),
    identifier,
    ipAddr,
    hasResult,
    algorithm,
    deviceInfo,
    speed,
  ]

  // append to log file
  fs.appendFileSync(newFilename, logData.join(';') + '\n')
  
  res.sendStatus(200)

}