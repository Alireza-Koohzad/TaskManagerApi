const {
  signupValidation,
  loginValidation,
  forgetValidation,
} = require("../validations/authValidation");
const express = require("express");

const router = express.Router();
const {
  signup,
  login,
  forgetPassword,
} = require("../controllers/authController");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

router.post("/forgetPassword", forgetValidation, forgetPassword);

module.exports = router;
