const { check } = require("express-validator");

exports.createTaskValidation = [
    check('text')
    .not()
    .isEmpty()
    .trim(),
    check('completed')
    .isBoolean(),
    check('category')
    .isArray()
]