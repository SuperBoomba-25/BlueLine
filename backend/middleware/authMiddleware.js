const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

// --- פונקציית הגנה (Protect) ---
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user ? decoded.user.id : decoded.id;

      req.user = await User.findById(userId).select("-password");

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

// --- פונקציית אדמין (Admin) - החדשה שהוספנו ---
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// 👇 ייצוא של שתי הפונקציות יחד
module.exports = { protect, admin };
