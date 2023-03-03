const BaseError = require("./baseError");
const httpStatusCode = require("./httpStatusCode");

class Api400Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCode.BAD_REQUEST,
    isOperational = true,
    description = "	Bad Request"
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Api400Error
