var express = require('express');
const path = require('path');
var cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');

const config = require('./config');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var  port = process.env.PORT || 8080


var app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

// DB Setup
mongoose.connect(config.mongo); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(morgan('combined'));

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
//require('./passport')();

require('./routes')(app);
const server = http.createServer(app);
server.listen(port);
console.log('Listening on port ' + port + '...');