const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens.push({
    access,
    token
  });

  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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

userSchema.methods.removeToken = function (token) {
  var user = this;
  return user. update({
    $pull: {
      tokens: {token}
    }
  });
};

// do before save()
userSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

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
