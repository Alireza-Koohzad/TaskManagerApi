const BaseError = require("./baseError");
const httpStatusCode = require("./httpStatusCode");

class Api500Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = "Intenal server."
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Api500Error
