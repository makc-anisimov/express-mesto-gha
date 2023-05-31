/* eslint-disable max-len */
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');

const {
  STATUS_OK,
  // NOT_FOUND,
  // INTERNAL_SERVER_ERROR,
  JWT_SECRET,
  ACCESS_DENIED,
} = require('../utils/consts');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
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
      throw new InternalServerError('На сервере произошла ошибка');
    }
    res.status(STATUS_OK).send(req.body);
  }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email })
    .select('+password')
    .orFail(() => res.status(ACCESS_DENIED).send({ message: 'Ошибка авторизации' }))
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
    .catch(next);
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  // updateAvatar,
  login,
};
