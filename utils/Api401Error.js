const BaseError = require("./baseError");
const httpStatusCode = require("./httpStatusCode");

class Api401Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCode.UN_AUTHORIZED,
    isOperational = true,
    description = "Unauthorized."
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Api401Error
