const { FORBIDDEN } = require('../utils/consts');

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
};
