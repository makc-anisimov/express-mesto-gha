const { NOT_FOUND } = require('../utils/consts');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
};
