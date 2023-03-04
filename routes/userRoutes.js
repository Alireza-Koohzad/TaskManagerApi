const {
  signupValidation,
  loginValidation,
  forgetValidation,
  resetValidation,
} = require("../validations/authValidation");
const express = require("express");

const router = express.Router();
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

router.post("/forgetPassword", forgetValidation, forgetPassword);
router.post("/resetPassword/:token", resetValidation, resetPassword);

module.exports = router;
