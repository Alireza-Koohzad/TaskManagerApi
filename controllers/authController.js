const { validationResult } = require("express-validator");
const cacthAsync = require("../utils/catchAsync");
const { createSendToken } = require("../utils/jwtUtils");
const User = require("../models/userModel");
const Api401Error = require("../utils/Api401Error");

exports.signup = cacthAsync(async (req, res, next) => {
  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    age: req.body.age,
  });
  //createToken
  const token = createSendToken(user, res);
  //send response
  user.password = undefined;
  res.status(201).json({
    status: "success",
    data: { user },
    token,
  });
});

exports.login = cacthAsync(async (req, res, next) => {
  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  //check exist user
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    console.log("AEG");
    return next(new Api401Error("invalid email or password" , 401))
  }
  // create token
  const token = createSendToken(user, res);
  //send response
  res.status(201).json({
    status: "success",
    data: {
      user
    },
    token,
  });
});
