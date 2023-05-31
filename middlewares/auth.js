const jsonwebtoken = require('jsonwebtoken');
const AccessDeniedError = require('../errors/access-denied-err');

const { JWT_SECRET } = require('../utils/consts');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AccessDeniedError('Необходима авторизация');
  }

  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    throw new AccessDeniedError('Необходима авторизация');
  }
  next();
};
module.exports = auth;
