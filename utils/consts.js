const STATUS_OK = 200;
const BAD_REQUEST = 400;
const ACCESS_DENIED = 401;
const NOT_FOUND = 404;
const FORBIDDEN = 403;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;
const JWT_SECRET = 'Lx9fheWor65gqDZIZkGyfXn0oDyxP296ViOR2QXoHWA34WLq';
const REGEXP_LINK = /^((https?):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;
module.exports = {
  STATUS_OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  JWT_SECRET,
  CONFLICT,
  ACCESS_DENIED,
  FORBIDDEN,
  REGEXP_LINK,
};
