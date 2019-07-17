var passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const config = require('./config');
const User = require('./models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

// super important that you use "username" in the body.
exports.authenticate = function (req, res, next) {
  res.send({
    token: tokenForUser(req.user),
    email: req.user.email,
    userName: req.user.userName,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
  });
};

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // generate a salt then run callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
    });
  });

  // See if a user with the given email exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password,
      userName: userName,
      firstName: firstName,
      lastName: lastName
    });

    user.save(function (err) {
      if (err) { return next(err); }

      // Repond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}

exports.getCurrentIdentity = function (req, res, next) {
  res.status(200).send(req.user);
  res.end();
}

exports.requiresApiLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403);
    res.end();
  } else {
    next();
  }
};

exports.requiresRole = function (role) {
  return function (req, res, next) {
    if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  }
}