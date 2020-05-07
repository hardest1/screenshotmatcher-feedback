const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const app = express();

const config = require('./config')

const PORT = process.env.PORT || config.PORT || 3000;

app.use((req, res, next) => {
  console.log( new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl )
  next()
})

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));

app.set('view engine', 'ejs');

const router = require('./src/router');

app.use('/', router);

app.use('/feedbacks', express.static(path.join(__dirname, 'feedbacks')))

app.listen(PORT, function () {
  console.log('Server listening on port ' + PORT);
});
