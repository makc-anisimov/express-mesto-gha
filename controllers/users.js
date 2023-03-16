const User = require('../models/user');

const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      const ERROR_CODE = 500;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then(() => res.status(200).send({ _id: req.user._id, ...req.body }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: ' Переданы некорректные данные при создании пользователя.' });
      }
    });
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...req.body } },
    { new: true },
  )
    .then(() => res.status(200).send(req.body))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...req.body } },
    { new: true },
  )
    .then(() => res.status(200).send(req.body))
    .catch((err) => {
      const ERROR_CODE = 500;
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара. ' });
      }
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
};
