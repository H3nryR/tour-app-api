module.exports = (err, req, res, next) => {
  // Express recognise it as error handling middleware
  // once we pass 4 arguments to middleware
  // err object has access to all error properties
  // declared in the controllers or other middleware
  // err.stack shows where error happened
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  //
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
