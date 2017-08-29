const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');
const {User} = require('./../server/models/user');

var id = '59a516cbd37ab6893c0bcbc0';

if(!ObjectID.isValid(id)) {
  console.log('ID not valid');
}
//
// Todo.find({
//   _id: id
// }).then((todo) => {
//   console.log('find', todo);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('findOne', todo);
// });

Todo.findById(id).then((todo) => {
  if(!todo) {
    return console.log('Id not found');
  }
  console.log('findById', todo);
}).catch((e) => console.log(e));


User.findById('59a3c8c528eb376e403dd362').then((user) => {
  if(!user) {
    return console.log('Unable to find user');
  }

  console.log(JSON.stringify(user, undefined, 2));

}, (e) => {
  console.log(e);
});
