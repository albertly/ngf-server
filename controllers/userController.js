const paginate = require('express-paginate');
const User = require('../models/user');
const tokenForUser = require('../utils/token.utils');
const bcrypt = require('bcrypt-nodejs');

// super important that you use "username" in the body.
exports.authenticate = function (req, res, next) {
  res.send({
    token: tokenForUser(req.user),
    email: req.user.email,
    userName: req.user.userName,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    roles: req.user.roles,
  });
};

exports.signup = function (req, res, next) {
  const email = req.body.email;
  let password = req.body.password;
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
    bcrypt.hash(password, salt, null, function (err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      password = hash;
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
      res.json({ 
        token: tokenForUser(user),
        email: email,
        userName: userName,
        firstName: firstName,
        lastName: lastName
       });
    });
  });
}

exports.updateUser = function(req, res, next) {
  
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;

  req.user.save(function(err) {
    if (err) { return next(err); }

    res.send({ firstName: req.user.firstName,  lastName:req.user.lastName});
    res.end(); 
  });
}



exports.getUsers = async (req, res, next) => {

  try {
     const [ results, itemCount ] = await Promise.all([
      User.find({}, {email:1, userName:1, firstName:1, lastName:1, roles:1,googleProvider:1})
      .limit(req.query.limit).skip(req.skip).lean().exec(),
      User.count({})
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);
    
    if (req.query.page > pageCount) {
      res.status(400).send('Wrong page number');
      return;
    }
    res.json({      
      nextPage: paginate.hasNextPages(req)(pageCount) ? paginate.href(req)(true) : '',
      previousPage: req.query.page > 1 ? paginate.href(req)(true) : '',
      pageCount,
      page: req.query.page,
      data: results.map(d =>  ({...d, googleProvider: d.googleProvider ? 1 : 0 }))
    });

  } catch (err) {
    next(err);
  }
};

exports.authGoogleUser = function(req, res) {
    
  if (!req.user) {
      return res.send(401, 'User Not Authenticated');
  }

  token = tokenForUser(req.user)
  res.setHeader('x-auth-token', token);
  res.status(200).send(JSON.stringify(req.user));
}

exports.upsertGoogleUser = function (accessToken, refreshToken, profile, cb) {

  return User.findOne({ 'googleProvider.id': profile.id })
      .then(user => {
          if (!user) {
              var newUser = new User({
                  email: profile.emails[0].value,
                  userName: profile.displayName,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  googleProvider: {
                      id: profile.id,
                      token: accessToken
                  }
              });

              newUser.save()
              .then(() =>  {
                cb(null, newUser );
              })
              .catch(err => {
                cb(err, null)
              });

          } else {
              cb(null, user);
          }
      }
      )
      .catch(err => {
          console.log('Error upsert', err);
          cb(err, null);
      });
}