const { BAD_REQUEST } = require('../utils/consts');

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
};
