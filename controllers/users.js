const User = require('../models/user');
const {
  STATUS_OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/consts');

const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (user !== null) {
        res.status(STATUS_OK).send(user);
      } else res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'переданы некорректные данные' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length > 0) res.status(STATUS_OK).send(users);
      else res.status(NOT_FOUND).send({ message: 'Пользователи не найдены' });
    })
    .catch(() => {
      res.stats(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then(() => {
      res.status(STATUS_OK).send({ _id: req.user._id, ...req.body });
    })
    .catch((err) => {
      res.status(BAD_REQUEST).send(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: ' Переданы некорректные данные при создании пользователя.' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      if (result !== null) {
        res.status(STATUS_OK).send(req.body);
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      // console.log('then result', result);
      if (result !== null) {
        res.status(STATUS_OK).send(req.body);
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
};
