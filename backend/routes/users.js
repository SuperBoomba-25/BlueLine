const express = require("express");
const User = require("../models/User");
const protectRoute = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// החזרת כל המשתמשים (אדמין בלבד)
router.get("/", protectRoute, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// חסימת/שחרור משתמש
router.put("/:id/ban", protectRoute, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: "Ban toggled", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// הפיכת משתמש לאדמין
router.put("/:id/make-admin", protectRoute, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: "User is now admin", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
