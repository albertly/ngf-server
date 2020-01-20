const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

const User = require('../models/user'); // const User = mongoose.model('users');
const config = require('../config/keys');
const userController = require('../controllers/userController');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  done(null, {user:'albert'});
  console.log('In jwtLogin');
  return;
  User.findById(payload.sub, {email:1, password:1, userName:1, firstName:1, lastName:1, roles:1,googleProvider:1}, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(new GoogleTokenStrategy({
  clientID: config.googleAuth.clientID,
  clientSecret: config.googleAuth.clientSecret
},
  function (accessToken, refreshToken, profile, done) {

    userController.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
      return done(err, user);
    });
  }));

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
