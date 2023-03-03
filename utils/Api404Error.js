const BaseError = require("./baseError");
const httpStatusCode = require("./httpStatusCode");

class Api404Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCode.NOT_FOUND,
    isOperational = true,
    description = "Not found."
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Api404Error
