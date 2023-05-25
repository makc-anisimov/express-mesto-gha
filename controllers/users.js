/* eslint-disable max-len */
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  STATUS_OK,
  // BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  JWT_SECRET,
  ACCESS_DENIED,
} = require('../utils/consts');

const getUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (user !== null) {
        res.status(STATUS_OK).send(user);
      } else res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length > 0) res.status(STATUS_OK).send(users);
      else res.status(NOT_FOUND).send({ message: 'Пользователи не найдены' });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
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
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
      next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email })
    .select('+password')
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Пользователь не найден' }))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        const {
          name,
          about,
          avatar,
          _id,
        } = user;
        return {
          name,
          about,
          avatar,
          email,
          _id,
        };
      }
      return res.status(ACCESS_DENIED).send({ message: 'Ошибка доступа' });
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user, jwt });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
