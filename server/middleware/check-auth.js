const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    // OPTIONS is a method used to check if a server supports a certain method
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization header is " Bearer TOKEN" => split at space and get the second element
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share"); //returns payload if token is valid
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    res.status(403).json({ message: "Authentication failed!" });
  }
};
