const jwt = require('jwt-simple');

const config = require('../config/keys');

module.exports = function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}