const jsonwebtoken = require('jsonwebtoken');

const {
  JWT_SECRET,
  ACCESS_DENIED,
} = require('../utils/consts');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(ACCESS_DENIED).send({ message: 'Необходима авторизация' });
  }

  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(ACCESS_DENIED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
