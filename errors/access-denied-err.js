const { ACCESS_DENIED } = require('../utils/consts');

module.exports = class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ACCESS_DENIED;
  }
};
