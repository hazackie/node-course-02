const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


// var message = 'I am number 3';
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'salt').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'salt').toString();
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed, dont trust.');
// }

var data = {
  id: 10
};

var token = jwt.sign(data, 'mysecret');
console.log(token);

var decoded = jwt.verify(token, 'mysecret');
console.log('decoded', decoded);
