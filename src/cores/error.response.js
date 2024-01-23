"use strict";

//* IMPORT
const {
  StatusCodes,
  ReasonPhrases,
} = require("../commons/utils/httpStatusCode");
const logger = require("../loggers/winston.log");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;

    logger.error(`${this.status} = ${this.message}`);
  }
}
class BadRequestRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}
class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}
module.exports = {
  BadRequestRequestError,
  InternalServerError,
  NotFoundError,
};
