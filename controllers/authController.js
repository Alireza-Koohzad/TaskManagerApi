const { validationResult } = require("express-validator");
const cacthAsync = require("../utils/catchAsync");
const { createSendToken } = require("../utils/jwtUtils");
const User = require("../models/userModel");
const Api401Error = require("../utils/Api401Error");
const { sendEmail } = require("../utils/sendEmail");
const Api500Error = require("../utils/Api500Error");

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
    return next(new Api401Error("invalid email or password", 401));
  }
  // create token
  const token = createSendToken(user, res);
  //send response
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});

exports.forgetPassword = cacthAsync(async (req, res, next) => {
  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check exist email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Api401Error("There is no user with email address.", 404));
  }
  //create token
  const resetToken = user.createPasswordResetToken();
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetToken/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;
  //send email
  try {
    sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new Api500Error("There was an error sending the email. Try again later!"),
      500
    );
  }
});
