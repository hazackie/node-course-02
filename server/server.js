const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

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

// delete
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('invalid id');
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('not todo');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  });
});


// patch
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('invalid id');
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.compeletedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send('not todo');
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send('Update fail');
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {app};
