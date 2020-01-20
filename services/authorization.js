const User = require('../models/user');

module.exports.requireAdmin = function (req, res, next) {
    next();
    console.log('req', req);
    if (req.user.roles === 'admin') {
        next();
    }
    else {
        return res.send(401, 'User Not Authorized');
    }

 }