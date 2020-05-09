require('dotenv').config()
module.exports = {
  FEEDBACK_PORT_HTTP: process.env.FEEDBACK_PORT_HTTP || 80,
  FEEDBACK_PORT_HTTPS: process.env.FEEDBACK_PORT_HTTPS || 443,
  FEEDBACK_DIR: __dirname + '/feedbacks',
  SECRET: process.env.FEEDBACK_SECRET,
  USERNAME: process.env.FEEDBACK_USER,
  PASSWORD: process.env.FEEDBACK_PASSWORD,
}