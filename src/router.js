const express = require('express')
const router = express.Router()

const dashboard = require('./dashboard')
const feedback = require('./feedback')

router.get('/', dashboard);

router.post('/feedback', feedback);

module.exports = router