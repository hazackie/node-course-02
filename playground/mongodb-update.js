const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/tododb', (err, db) => {
  if(err) {
    return console.log("Unable to connect DB");
  }

  console.log('Connected DB');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('599e51d2778fb342112c84f0')
  }, {
    $set: {
      name: 'Zack H',
      location: 'Quang Tri'
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  db.close();
});
