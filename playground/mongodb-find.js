const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/tododb', (err, db) => {
  if(err) {
    return console.log('Unable to connect MongoDB server.');
  }

  // db.collection('Todos').find({
  //   _id: new ObjectID('599e509d07710141dc850459')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch Todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`)
  // }, (err) => {
  //   console.log('Unable to count', err);
  // });

  db.collection('Users').find({name: 'Zack'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    if(err) {
      console.log(err);
    }
  });

  // db.close();
});
