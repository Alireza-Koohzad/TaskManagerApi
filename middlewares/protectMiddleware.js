const User = require("../models/userModel");
const Api401Error = require("../utils/Api401Error");
const { verifyToken } = require("../utils/jwtUtils");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(new Api401Error("you are not logged in, please log in", 401));
  }
  let decoded = verifyToken(token);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new Api401Error("user not found with this token ", 401));
  }
  req.user = user;
  next();
};

module.exports = protect
