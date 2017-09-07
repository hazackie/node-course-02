const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// User
var Schema = mongoose.Schema;
var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// only return what we want to user
userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// generate auth token
userSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth'  ;
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens.push({
    access,
    token
  });

  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject(); // an option
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

var User = mongoose.model('User', userSchema);

// var newUser = new User({
//   name: 'Zack H',
//   location: 'Quang Tri, Viet Nam    ',
//   age: 23,
//   email: 'hazack@gmail.com'
// });
// newUser.save().then((doc) => {
//   console.log('Successful', doc);
// }, (e) => {
//   console.log(e);
// });

module.exports = {User};
