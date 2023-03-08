const { validationResult } = require("express-validator");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Api400Error = require("../utils/Api400Error");
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
    console.log("Aeg");
    data = { ...data, text: req.body.text };
  }
  if (req.body.completed.toString()) {
    console.log(typeof req.body.completed);
    if (typeof req.body.completed != "boolean") {
      return next(new Api400Error("this field must be boolean", 400));
    }
    data = { ...data, completed: req.body.completed };
  }
  if (Object.keys(data).length === 0) {
    return next(new Api400Error("No fields were entered to update", 400));
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
