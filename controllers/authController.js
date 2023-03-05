const { validationResult } = require("express-validator");
const cacthAsync = require("../utils/catchAsync");
const { createSendToken } = require("../utils/jwtUtils");
const User = require("../models/userModel");
const Api401Error = require("../utils/Api401Error");
const { sendEmail } = require("../utils/sendEmail");
const Api500Error = require("../utils/Api500Error");
const Api400Error = require("../utils/Api400Error");
const crypto = require("crypto");
const Api404Error = require("../utils/Api404Error");

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
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
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

exports.resetPassword = cacthAsync(async (req, res, next) => {
  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //compare input token vs password reset token in database
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Api400Error("invalid reset token", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save({ validateBeforeSave: false });
  //create token because password changed
  const token = createSendToken(user, res);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});

exports.updatePassword = cacthAsync(async (req, res, next) => {
  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { currentPassword, newPassword, confirmPassword } = req.body;
  //check exist user
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new Api404Error("user not found with this ID", 404));
  }
  //check current password in input vs password in database
  if (!(await user.comparePassword(currentPassword, user.password))) {
    return next(new Api401Error("current password is wrong", 401));
  }
  //update password and confirm password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save();
  

  //Log user in, send JWT
  const token = createSendToken(user, res);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});
