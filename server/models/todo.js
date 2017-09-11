var mongoose = require('mongoose');

// save new something
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  }
});

// var otherTodo = new Todo({
//   text: 'Edit       this video',
//   completed: false
// });
// otherTodo.save().then((doc) => {
//   console.log('Saved', doc);
// }, (e) => {
//   console.log('Failed', e);
// });


module.exports = {Todo};
