const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Api400Error = require("../utils/Api400Error");
const Api401Error = require("../utils/Api401Error");
const Api404Error = require("../utils/Api404Error");
const Api500Error = require("../utils/Api500Error");
const catchAsync = require("../utils/catchAsync");
const index = require("../utils/indexAggregate");

exports.getAllTask = catchAsync(async (req, res, next) => {
  let query = { userId: new mongoose.Types.ObjectId(req.user.id) };
  let sort = {};
  sort = { ...sort, _id: -1 };
  if (req.query.completed) {
    console.log(req.query.completed);
    query.completed = req.query.completed === "true";
  }
  const queryData = [{ $match: query }];

  const aggregateData = [
    {
      $project: {
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ];
  const result = await index(req, "task", queryData, aggregateData, sort);
  if (!result) return next(new Api500Error("interval error", 500));
  res.status(200).json({
    status: "success",
    data: {
      result,
    },
  });
});

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

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id).select('-__v -createdAt -updatedAt');
  if (!task) {
    return next(new Api401Error("task not found with this ID", 404));
  }
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
  if (req.body.completed !== undefined) {
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
