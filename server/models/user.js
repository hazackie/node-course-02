var mongoose = require('mongoose');

// User
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  location:{
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
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
