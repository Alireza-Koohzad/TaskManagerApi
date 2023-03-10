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
const {
  getAllUsers,
  getUser,
  updateMe,
  uploadAvatar,
} = require("../controllers/userController");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/forgetPassword", forgetValidation, forgetPassword);
router.post("/resetPassword/:token", resetValidation, resetPassword);

router.patch(
  "/updatePassword",
  protect,
  restrictTo("user"),
  updatePasswordValidation,
  updatePassword
);
router.route("/avatar").patch(protect,uploadAvatar)


// router.use(restrictTo('admin'));

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(protect, updateMe);


module.exports = router;
