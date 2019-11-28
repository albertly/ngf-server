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
  },
  roles: { type: String,  lowercase: true, trim: true, default: '' },
  emailConfirmed: false,
  authToken: String,
  orders: [{ type: Schema.Types.ObjectId, ref: 'order' }]
});


userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
