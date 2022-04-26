const express = require("express");
const AppError = require("./helpers/appError");
const errorController = require("./controllers/errorController");
const tourRouter = require("./routers/tourRouter.js");
const userRouter = require("./routers/userRouter.js");
const morgan = require("morgan");

// Attach APP to express
const app = express();
// Static files
app.use(express.static(`${__dirname}/public`));
// Morgan MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// MIDDLEWARE Body Parsing - populating req.body with the received JSON data
app.use(express.json());
// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
// MIDDLEWARE for detecting all the other URL
app.all("*", (req, res, next) => {
  // nothing after that middleware, so no need for next();
  // const err = new Error(`Can not find: ${req.originalUrl} `);
  // err.status = "Fail";
  // err.statusCode = 404;
  // passing err to next - express will now its en err
  next(new AppError(`Can not find: ${req.originalUrl} `, 404));
});
// Error Controller
app.use(errorController);
// Exports
module.exports = app;
