var users = require('../database/users'),
  getNextId = require('./getNextId');

const User = require('../models/user');
var nextId = getNextId(users);

exports.updateUser = function(req, res, next) {
  
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;

  req.user.save(function(err) {
    if (err) { return next(err); }

    res.send({ firstName: req.user.firstName,  lastName:req.user.lastName});
    res.end(); 
  });
}

// exports.updateUser = function(req, res) {
//   var updatedUser = req.body;

//   var foundUser = users.find(user => user.id === parseInt(req.params.id));
//   if(foundUser) {
//     foundUser.firstName = updatedUser.firstName;
//     foundUser.lastName = updatedUser.lastName;
//   }

//   res.send(foundUser);
//   res.end();
// }

exports.createUser = function(req, res) {
  var newUser = req.body;
  newUser.id = nextId;
  nextId++;
  users.push(newUser);
  
  res.send(newUser);
  res.end(); 
}

exports.getUsers = function(req, res) {
  res.send(users);
  res.end();
}


exports.upsertGoogleUser = function (accessToken, refreshToken, profile, cb) {

  console.log('profile', profile)
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

              newUser.save(function (error, savedUser) {
                  if (error) {
                      console.log(error);
                  }
                  return cb(error,
                      {...savedUser, userName: profile.displayName, firstName: profile.name.givenName, lastName: profile.name.familyName});
              });
          } else {
              return cb(null,
                  {...user, email: profile.emails[0].value, userName: profile.displayName, firstName: profile.name.givenName, lastName: profile.name.familyName});
          }
      }
      )
      .catch(err => {
          console.log('Error upsert', err);
          return cb(err, null);
      });
}