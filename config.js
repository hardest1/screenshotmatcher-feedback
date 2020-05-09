require('dotenv').config()
module.exports = {
  PORT: process.env.PORT ||3000,
  FEEDBACK_DIR: __dirname + '/feedbacks',
  SECRET: process.env.SECRET,
  USERNAME: process.env.USER,
  PASSWORD: process.env.PASSWORD,
}