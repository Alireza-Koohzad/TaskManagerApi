const { check } = require("express-validator");

exports.createTaskValidation = [
  check("text", "text is required").not().isEmpty().trim(),
  check("completed", "completed must be boolean").isBoolean(),
  check("category", "category must be array").optional().isArray(),
];
