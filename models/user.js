const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true, trim: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
  password: String,
  userName: String,
  firstName: String,
  lastName: String,
  googleProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
});


userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

userSchema.statics.upsertGoogleUser = function (accessToken, refreshToken, profile, cb) {
  var that = this;
  console.log('profile', profile)
  return this.findOne({ 'googleProvider.id': profile.id })
      .then(user => {
          if (!user) {
              var newUser = new that({
                  email: profile.emails[0].value,
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

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
