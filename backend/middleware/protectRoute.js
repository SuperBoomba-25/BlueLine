const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const protectRoute = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // פענוח הטוקן
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded מכיל { id, role }
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      return next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Token is invalid" });
    }
  }

  return res.status(401).json({ message: "No token, access denied" });
};

module.exports = protectRoute;
