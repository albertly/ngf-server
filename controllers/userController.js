var crypto = require('crypto');

const paginate = require('express-paginate');
const User = require('../models/user');
const tokenForUser = require('../utils/token.utils');
const bcrypt = require('bcrypt-nodejs');
const sendMail = require('../utils/sendMail.util');
const keys = require('../config/keys');

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

    //ToDo: Token should be asymetric encrypted 
    //generate authentication token
    const seed = crypto.randomBytes(20);
    const authToken = crypto.createHash('sha1').update(seed + email).digest('hex');

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email,
      password,
      userName,
      firstName,
      lastName,
      authToken
    });

    user.save(function (err) {
      if (err) { return next(err); }

      const link="http://"+req.get('host')+"/api/verify/"+ authToken;

      const to = 'albert.lyubarsky@gmail.com'; //email;
      const from = keys.sendgrid.sendgrid_from;
      const subject = 'Please confirm your Email account';
      const text = 'a';
      const html = 'Hello,<br> Please Click on the link to verify your email.<br><a href="'+ link + '">Click here to verify</a>';

     // 
      sendMail(to, from, subject, text, html).then(result => {
        // Repond to request indicating the user was created
        console.log(result);
        res.json({ 
          token: tokenForUser(user),
          email: email,
          userName: userName,
          firstName: firstName,
          lastName: lastName
        })
      }).catch(
        err => console.log(err)
      );


    });
  });
}

exports.verify = function(req, res, next) {
  User.findOne({ authToken: req.params.id }, function (err, user) {
    if (err) { return next(err); }

    if (user) {
      user.emailConfirmed = true;

      user.save(function(err) {
        if (err) { return next(err); }
    
        return res.status(204).send();
      });
    }
    else {
     return res.status(422).send({ error: 'Something went wrong' });
    }

  });
}

// ToDo: get id param from body, check if admin, cannot delete himself
exports.deleteUser = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function (err, result) {
    if (err) { return next(err); }
    res.status(204).send();
  });
}

exports.updateUser = function(req, res, next) {
  
  if (req.user.googleProvider) {
    res.status(406).send("Cannot update third party OAuth user");
    res.end();
    return;
  }

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