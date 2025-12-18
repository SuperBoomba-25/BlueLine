// backend/middleware/protectRoute.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    // חייב להגיע: "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // הטוקן שלך נוצר כ: { id: user._id, role: user.role }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // כולל role
    next();
  } catch (err) {
    console.error("protectRoute error:", err.message);
    return res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = { protect };
