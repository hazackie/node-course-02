var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.json());

// post
app.post('/todos', (req, res) => {
  // console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// get
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // validate id using isValid
  // 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('invalid id');
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('not todo');
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send('catch');
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = {app};
