

const neatCsv = require('neat-csv')
const fs = require('fs')
const sha1 = require('sha1')
const moment = require('moment')
const { parse } = require('path')

const config = require('../config')
const { getDirectories, getFilesByEnding } = require('./util')

class User {

}

module.exports = async (req, res) => {

  const uniqueUserIDs = []
  const users = []

  const rawFeedbacks = []
  const rawLogEntries = []

  // Get all data files
  const dirListFeedback = getDirectories(config.FEEDBACK_DIR)
  const fileListLog = getFilesByEnding(config.LOG_DIR)

  // Parse Feedback list
  dirListFeedback.forEach(c => {
    const infoJson = fs.readFileSync(config.FEEDBACK_DIR + '/' + c + '/info.json', 'utf-8');
    const infoData = JSON.parse(infoJson);

    infoData.moment = moment(infoData.time, "DD.MM.YY HH:mm:ss");


    if(typeof infoData.identifier === 'string'){
      let tmpID = infoData.identifier
      infoData.hashedID = sha1(tmpID)
      if( !uniqueUserIDs.includes(tmpID) ){
        uniqueUserIDs.push(tmpID)
        let newUser = { hashedID: sha1(tmpID), feedbacks: 1, matches: 0, fails: 0, surf: 0, orb: 0, devices: {}, speeds: [] }
        users[tmpID] = newUser
      }
      else{
        users[tmpID].feedbacks += 1
      }
    }

    
    const newFb = { dir: c, infoData }

    rawFeedbacks.push(newFb)
  })

  // Parse Log Entry list
  for (let index = 0; index < fileListLog.length; index++) {

    const csvFile = fileListLog[index];
    const rawCsvData = fs.readFileSync(config.LOG_DIR + '/' + csvFile, 'utf-8');

    const parsedResult = await neatCsv(rawCsvData, { separator: ';', headers: ['time', 'identifier', 'ip', 'hasResult', 'algorithm', 'device', 'speed'] })

    // Loop through lines

    for (let lineIndex = 0; lineIndex < parsedResult.length; lineIndex++) {
      const element = parsedResult[lineIndex];
      
      if(typeof element.identifier === 'string'){
        let tmpID = element.identifier

        if( !uniqueUserIDs.includes(tmpID) ){
          uniqueUserIDs.push(tmpID)
          let newUser = { hashedID: sha1(tmpID), feedbacks: 0, matches: 1, fails: 0, surf: 0, orb: 0, devices: {}, speeds: [] }
          users[tmpID] = newUser
          if(element.hasResult == 'False') users[tmpID].fails += 1
        }
        else{
          users[tmpID].matches += 1
          if(element.hasResult == 'False') users[tmpID].fails += 1
        }

        if(element.algorithm == 'SURF') users[tmpID].surf += 1
        else users[tmpID].orb += 1

        users[tmpID].speeds.push(element.speed)

        if(users[tmpID].devices[element.device.trim()]) users[tmpID].devices[element.device.trim()] += 1
        else users[tmpID].devices[element.device.trim()] = 1
        
      }
    }
    
  }

  const feedbacks = rawFeedbacks.sort((a, b) => b.infoData.moment.diff(a.infoData.moment))

  
  for (const userID in users) {
    if (users.hasOwnProperty(userID)) {
      const element = users[userID];
      if(element.speeds.length) element.speeds = ( element.speeds.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / element.speeds.length * 1000 ).toFixed(0)
      else element.speeds = 0
    }
  }


  const dataPayload = {
    feedbacks,
    users
  }

  res.render('dashboard', dataPayload);

}