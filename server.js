var express = require('express');
const path = require('path');
var cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');

const config = require('./config');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var  port = process.env.PORT || 5000


var app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

// DB Setup
mongoose.connect(config.mongo); 

//require('./expressConfig')(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(morgan('combined'));
app.use(cors());
//require('./passport')();

require('./routes')(app);
const server = http.createServer(app);
server.listen(port);
console.log('Listening on port ' + port + '...');