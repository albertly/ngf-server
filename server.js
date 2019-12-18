const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/keys');

require('./services/cache');
mongoose.Promise = global.Promise;

const  port = process.env.PORT || 8080


const app = express();

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

require('./routes')(app);
require('./billingRoutes')(app);
require('./utilRoutes')(app);
const server = http.createServer(app);
server.listen(port);
console.log('Listening on port ' + port + '...');