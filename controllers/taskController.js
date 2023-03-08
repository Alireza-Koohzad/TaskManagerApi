const { validationResult } = require("express-validator");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Api404Error = require("../utils/Api404Error");
const catchAsync = require("../utils/catchAsync");

exports.createTask = catchAsync(async (req, res, next) => {
  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check exist user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new Api404Error("user not found with this ID", 404));
  }
  //create task and save in db
  const { text, completed = false } = req.body;
  let data = { text, completed, userId: req.user.id };
  if (req.body.category) {
    data = { ...data, category: req.body.category };
  }
  const task = await Task.create(data);

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new Api404Error("task not found with this ID", 404));
  }
  let data = {};
  if (req.body.text) {
    data = { ...data, text: req.body.text };
  }
  if (req.body.completed) {
    data = { ...data, completed: req.body.completed };
  }
  await Task.findByIdAndUpdate(req.params.id, data);
  res.status(200).json({
    status: "success",
    message: "task updated successfully",
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new Api404Error("task not found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "task deleted successfully",
  });
});

