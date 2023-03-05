const {
  signupValidation,
  loginValidation,
  forgetValidation,
  resetValidation,
  updatePasswordValidation,
} = require("../validations/authValidation");
const express = require("express");

const router = express.Router();
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const protect = require("../middlewares/protectMiddleware");
const restrictTo = require("../middlewares/restrictToMiddleware");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

router.post("/forgetPassword", forgetValidation, forgetPassword);
router.post("/resetPassword/:token", resetValidation, resetPassword);

router.patch("/updatePassword", protect , restrictTo('user') , updatePasswordValidation , updatePassword);

module.exports = router;
