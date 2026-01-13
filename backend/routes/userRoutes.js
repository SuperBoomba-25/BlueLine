const express = require("express");
const User = require("../models/User");
const router = express.Router();

// ייבוא מותאם לצורת הייצוא
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/admin");

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BAN / UNBAN
router.put("/:id/ban", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({
      message: `User is now ${user.isBanned ? "banned" : "unbanned"}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MAKE ADMIN
router.put("/:id/make-admin", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = "admin";
    await user.save();
    res.json({ message: "User is now admin", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
