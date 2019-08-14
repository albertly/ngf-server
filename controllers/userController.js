const User = require('../models/user');

exports.updateUser = function(req, res, next) {
  
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;

  req.user.save(function(err) {
    if (err) { return next(err); }

    res.send({ firstName: req.user.firstName,  lastName:req.user.lastName});
    res.end(); 
  });
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
              cb(null,
                  {...user, email: profile.emails[0].value, userName: profile.displayName, firstName: profile.name.givenName, lastName: profile.name.familyName});
          }
      }
      )
      .catch(err => {
          console.log('Error upsert', err);
          cb(err, null);
      });
}