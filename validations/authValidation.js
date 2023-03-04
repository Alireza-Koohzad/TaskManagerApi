const { check } = require("express-validator");
const User = require("../models/userModel");

exports.signupValidation = [
  check("name", "name is required").not().isEmpty(),
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .trim()
    .normalizeEmail()
    .withMessage("please enter valid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email is already in use!");
      }
      return true;
    }),
  check("password")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("password is required and must be 5 or more characters"),
  check("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("confirmPassword is required and must be same password")
    .custom((value, { req }) => {
      const password = req.body.password;
      if (value && password !== value)
        throw new Error("Passwords must be same");
      return true;
    }),
  check("age").custom((value) => {
    if (value < 0) {
      throw new Error("age must be positive!");
    }
    if (value < 10) {
      throw new Error("age must be more than 10 years old");
    }
    return true;
  }),
];

exports.loginValidation = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .trim()
    .normalizeEmail()
    .withMessage("please enter valid email"),
  check("password")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("password is required and must be 5 or more characters"),
];

exports.forgetValidation = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .trim()
    .normalizeEmail()
    .withMessage("please enter valid email"),
];

exports.resetValidation = [
  check("password")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("password is required and must be 5 or more characters"),
  check("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("confirmPassword is required and must be same password")
    .custom((value, { req }) => {
      const password = req.body.password;
      if (value && password !== value)
        throw new Error("Passwords must be same");
      return true;
    }),
];
