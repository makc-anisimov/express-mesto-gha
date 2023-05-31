const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const {
  login,
  createUser,
} = require('./controllers/users');
const {
  loginValidation,
  createUserValidation,
} = require('./middlewares/validation');

// const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
app.use(helmet());
// app.use(express.static(path.join((__dirname, 'public'))));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});
// app.use((err, req, res) => {
//   res.status(err.statusCode).send({ message: err.message });
// });
// app.use(errorHandler); // кастомный обработчик ошибок
app.listen(PORT, () => {
  console.log('START APP MY TEST!');
});
