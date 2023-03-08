const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const router = express.Router();

const protect = require("../middlewares/protectMiddleware");
const restrictTo = require("../middlewares/restrictToMiddleware");
const { createTaskValidation } = require("../validations/taskValidation");

router.use(protect);

router.route("/").post(createTaskValidation, createTask);

router.route("/:id").patch(updateTask).delete(deleteTask);

module.exports = router;
