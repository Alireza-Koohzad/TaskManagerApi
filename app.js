const express = require("express");
const dotenv = require('dotenv')
const app = express();

// app.all("*", (req, res, next) => {

// });



dotenv.config({ path: '.env' });
const port = process.env.SERVER_PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
