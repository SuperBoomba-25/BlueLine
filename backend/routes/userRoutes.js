const express = require("express");
const User = require("../models/User");
const router = express.Router();

// CREATE – יצירת משתמש חדש (ל-admin, השתמש ב-register לאחרים)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ – כל המשתמשים
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // לא לשלוח סיסמה (אבטחה)
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ – משתמש לפי אימייל
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE – עדכון משתמש (פרופיל, סעיף 4.3.3)
router.put("/:email", async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { name, role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE – מחיקת משתמש
router.delete("/:email", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ email: req.params.email });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
