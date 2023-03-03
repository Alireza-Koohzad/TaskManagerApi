const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

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
const errorController = require("./controllers/errorController");

app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  throw new Error("این ادرس یافت نشد");
});

app.use(errorController)
dotenv.config({ path: ".env" });
const port = process.env.SERVER_PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
