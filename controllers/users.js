/* eslint-disable max-len */
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/access-denied-err');

const {
  STATUS_OK,
  JWT_SECRET,
} = require('../utils/consts');

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      console.log('req.params.userId', req.params.userId);
      console.log('user', user);
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
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
    .then((createdUser) => {
      res.status(STATUS_OK).send({
        name: createdUser.name,
        about: createdUser.about,
        avatar: createdUser.avatar,
        email: createdUser.name,
        _id: createdUser._id,
      });
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
  ).then((result) => {
    if (!result) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_OK).send(req.body);
  }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AccessDeniedError('Ошибка авторизации');
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AccessDeniedError('Ошибка доступа');
      }
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
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user, jwt });
    })
    .catch(next);
};

module.exports = {
  getUserMe,
  getUser,
  getUsers,
  createUser,
  updateProfile,
  login,
};
