const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const http = require('http');
const https = require('https');
const app = express();

const config = require('./config')

const PORT = process.env.PORT || config.PORT || 3000;

const privateKey  = fs.readFileSync('ssl/hartmann-it.de.key', 'utf8');
const certificate = fs.readFileSync('ssl/hartmann-it.de.cer', 'utf8');
const sslCredentials = {key: privateKey, cert: certificate};

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

const httpsServer = https.createServer(sslCredentials, app);

httpsServer.listen(config.FEEDBACK_PORT_HTTPS, () => {
  console.log('Server listening on port ' + PORT);
});

http.createServer(function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(config.FEEDBACK_PORT_HTTP, () => console.log('HTTP Server listening'));
