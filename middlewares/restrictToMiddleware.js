const Api401Error = require("../utils/Api401Error");

const restrictTo = (...roles) => {
  return async (req, res, next) => {
    let matched = false;
    roles.forEach((element) => {
      console.log(element);
      if (element === req.user.role) {
        matched = true;
      }
    });
    if (matched) return next();
    return next(new Api401Error("you have not access to this route", 401));
  };
};

module.exports = restrictTo;
