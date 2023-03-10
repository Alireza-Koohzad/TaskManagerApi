const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(bodyParser.json());
app.use(multer({storage : fileStorage, fileFilter : fileFilter}).single('image'))
app.use(cors());
// app.use("/images", express.static(path.join(__dirname, "images")));

//connect to DB
mongoose.connect(
  `mongodb+srv://alirezakoohzad:alireza894@cluster0.k8p9o.mongodb.net/task-manager`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const errorController = require("./controllers/errorController");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.all("*", (req, res, next) => {
  throw new Error("این ادرس یافت نشد");
});

app.use(errorController);
dotenv.config({ path: ".env" });
const port = process.env.SERVER_PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
