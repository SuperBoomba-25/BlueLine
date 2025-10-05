const express = require("express");
const bcrypt = require("bcrypt"); // לאבטחה
const jwt = require("jsonwebtoken"); // token 
const User = require("../models/User");

const router = express.Router();

// POST /api/register (הרשמה, 4.3.1)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "משתמש כבר קיים עם המייל הזה" });
    }

    // יצירת משתמש חדש (הצפנה אוטומטית במודל)
    const newUser = new User({
      name,
      email,
      password,
      role: role || "user", // default, enum user/admin
    });

    await newUser.save();

    res.status(201).json({
      message: "משתמש נרשם בהצלחה",
      user: { _id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאת שרת", error: err.message });
  }
});

// POST /api/login (התחברות, סעיף 4.3.2)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "משתמש לא נמצא" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "סיסמה שגויה" });

    // צור token (JWT, לאבטחה)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "התחברות הצליחה",
      token,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאת שרת", error: err.message });
  }
});

module.exports = router;
