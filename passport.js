const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy;

const config = require('./config');
const users = require('./database/users');
const userController = require('./controllers/userController');

module.exports = function () {
  passport.use(new LocalStrategy(
    function (username, password, done) {
      var found = users.find(user => {
        return user.userName.toLowerCase() === username;
      })
      if (found) {
        return done(null, found);
      } else {
        return done(null, false);
      }

    }
  ));

  passport.use(new GoogleTokenStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret
  },
    function (accessToken, refreshToken, profile, done) {

      userController.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
        return done(err, user);
      });
    }));

  passport.serializeUser(function (user, done) {
    if (user) {
      done(null, user.id);
    }
  });

  passport.deserializeUser(function (id, done) {
    var found = users.find(user => {
      return user.id === id;
    })
    if (found) {
      return done(null, found);
    } else {
      return done(null, false);
    }
  })

}