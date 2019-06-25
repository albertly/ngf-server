var express = require('express');
const path = require('path');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var  port = process.env.PORT || 5000

var cors = require('cors');
var app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

require('./expressConfig')(app);

require('./passport')();

require('./routes')(app);

app.listen(port);
console.log('Listening on port ' + port + '...');