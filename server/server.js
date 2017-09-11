require('./config/config');


const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;
console.log(process.env.MONGODB_URI);
app.use(bodyParser.json());

// POST /users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// logout
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    // res.send(user);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

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
