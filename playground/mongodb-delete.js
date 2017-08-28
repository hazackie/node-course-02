const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/tododb', (err, db) => {
  if(err) {
    return console.log("Unable to connect DB");
  }

  console.log('Connected DB');
  // db.collection('Todos').deleteMany({text: 'Have sex'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne({text: 'Have sex'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
    console.log(result);
  });
});
