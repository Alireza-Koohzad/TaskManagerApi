const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    photo: String,
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: [
      {
        type: String,
        default: "all",
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
