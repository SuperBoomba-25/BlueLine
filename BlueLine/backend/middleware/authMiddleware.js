const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const protectRoute = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded.user;

      return next();
    } catch (err) {
      return res.status(401).json({ message: "הטוקן לא תקין" });
    }
  }

  return res.status(401).json({ message: "אין טוקן, גישה נדחתה" });
};

module.exports = protectRoute;
