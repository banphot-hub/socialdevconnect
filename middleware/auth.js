const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = (req, res, next) => {
  //Get token from header with customer header
  const token = req.header("x-auth-token");
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token authorization denied" });
  }

  //Verify token
  try {
    const decode = jwt.verify(token, config.secretOrKey);
    req.user = decode.user;
     
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
