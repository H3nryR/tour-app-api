class AppError extends Error {
  // we want to inherit all global error objects, so we extend
  constructor(message, statusCode) {
    // we extend by err.message
    super(message);
    // message is already set

    this.statusCode = statusCode;
    // Status depends on Status code
    // if status code starts with '4' - status is fail, otherwise it is 'error;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // later to do...
    this.isOperational = true;
    // this.isOperational = true;
    //
    // this is use to not pollute stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
