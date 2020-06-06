const express = require('express')
const basicAuth = require('express-basic-auth')
const router = express.Router()

const config = require('../config')

const dashboard = require('./dashboard')
const feedback = require('./feedback')
const log = require('./log')

const username = config.USERNAME;
const password = config.PASSWORD;

const users = {}
users[username] = password

router.get('/', basicAuth({ users, challenge: true }), dashboard);

router.post('/feedback', feedback);
router.post('/log', log);

module.exports = router