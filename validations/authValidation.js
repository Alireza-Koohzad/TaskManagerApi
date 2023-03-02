const { check } = require("express-validator");
const User = require("../models/userModel");

exports.signupValidation = [
  check("name", "name is required").not().isEmpty(),
  check("email", "please enter valid email")
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail(),
  check("password", "password is required and must be 5 or more characters")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email is already in use!");
      }
    }),
  check(
    "confirmPassword",
    "confirmPassword is required and must be same password"
  )
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      const password = req.body.password;
      if (password !== value) throw new Error("Passwords must be same");
    }),
  check("age").custom((value) => {
    if (value < 0) {
      throw new Error("age must be positive!");
    }
    if (value < 10) {
      throw new Error("age must be more than 10 years old");
    }
  }),
];

exports.loginValidation = [
  check("email", "please enter valid email")
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail(),
  check("password", "password is required and must be 5 or more characters")
    .not()
    .isEmpty()
    .isLength({ min: 5 }),
];
