const express = require('express')
const basicAuth = require('express-basic-auth')
const router = express.Router()

const config = require('../config')

const dashboard = require('./dashboard')
const feedback = require('./feedback')

const username = config.USERNAME;
const password = config.PASSWORD;

const users = {}
users[username] = password

router.get('/', basicAuth({ users, challenge: true }), dashboard);

router.post('/feedback', feedback);

module.exports = router