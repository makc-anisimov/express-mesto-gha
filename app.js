const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.static(path.join((__dirname, 'public'))));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     // _id: '6416f3753b465db6af045000', // TEST
//     _id: '6416f3753b465db6af045edf',
//   };
//   next();
// });
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log('START APP MY TEST!');
});
