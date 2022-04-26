const jwt = require("jsonwebtoken");
const userModel = require("./../models/userModel");
const appError = require("./../helpers/appError");

exports.signup = async (req, res) => {
  try {
    // !BREACH HERE! | here anyone can specify some extra fields (ex admin role)
    // const newUser = await userModel.create(req.body);
    // Better like this below. Even if the user will try to manipulate req.body with
    // additional fields, we will not store it
    const newUser = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed to create new User",
      message: err,
    });
  }
};
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exists if no throw err
    if (!email || !password) {
      return next(new appError("Please provide email and password!", 400));
    }
    // 2) Check if user exist AND password is correct
    // we are selecting explicitly password because it's hidden in schema
    const user = await userModel.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(AppError("Incorrect email or password"), 401);
    }

    // 3) If everything is fine, send token to the client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      status: "Failed to login",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // console.log(req.headers);
    // 1) Get the token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);

    if (!token) {
      return next(new AppError("You are not logged in!"), 401);
    }
    // 2) Verify token
    // 3) Check if user still exist
    // 4) Check if user changed credentials after the token was issued
  } catch (err) {
    res.status(400).json({
      status: "Access Forbidden",
      message: err,
    });
  }
  next();
};
