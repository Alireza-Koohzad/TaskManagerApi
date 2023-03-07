const User = require("../models/userModel");
const Api401Error = require("../utils/Api401Error");
const Api500Error = require("../utils/Api500Error");
const catchAsync = require("../utils/catchAsync");
const index = require("../utils/indexAggregate");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let query = {};
  let sort = {};
  sort = { ...sort, _id: -1 };
  const queryData = [{ $match: query }];
  const aggregateData = [
    {
      $project: {
        __v: 0,
        password: 0,
      },
    },
  ];
  const result = await index(req, "user", queryData, aggregateData, sort);
  if (!result) return next(new Api500Error("interval error", 500));
  res.status(200).json({
    status: "success",
    data: {
      result,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new Api401Error("user not found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody);

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new Api401Error("user not found with this ID", 404));
  }
  await User.findByIdAndUpdate(id, { active: false });
  res.status(200).json({
    status: "success",
    message: "this your account deactivated",
  });
});
