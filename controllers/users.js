const User = require('../models/user');

const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => res.status(200).send(user));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users));
};

const createUser = (req, res) => {
  // console.log('test Create user', res);
  User.create({ ...req.body })
    .then(() => res.status(200).send(req.body));
};
module.exports = {
  getUser,
  getUsers,
  createUser,
};
