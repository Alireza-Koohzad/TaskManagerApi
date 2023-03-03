const { signupValidation, loginValidation } = require("../validations/authValidation");
const express = require('express')

const router = express.Router();
const {signup, login} = require('../controllers/authController')

router.post('/signup', signupValidation , signup)
router.post('/login' , loginValidation , login)



module.exports = router