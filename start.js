const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

const config = require('./config')

const privateKey  = fs.readFileSync('ssl/hartmann-it.de.key', 'utf8');
const certificate = fs.readFileSync('ssl/hartmann-it.de.cer', 'utf8');
const sslCredentials = {key: privateKey, cert: certificate};

app.use((req, res, next) => {
  console.log( new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl )
  next()
})

app.use(bodyParser.urlencoded({extended: true}))

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));

app.set('view engine', 'ejs');

const router = require('./src/router');

app.use('/', router);

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use('/feedbacks', express.static(path.join(__dirname, 'feedbacks')))

const httpsServer = https.createServer(sslCredentials, app);

httpsServer.listen(config.FEEDBACK_PORT_HTTPS, () => {
  console.log('HTTPS Server listening on port ' + config.FEEDBACK_PORT_HTTPS);
});

http.createServer(function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(config.FEEDBACK_PORT_HTTP, () => console.log('HTTP Server listening on port ' + config.FEEDBACK_PORT_HTTP));
