const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ******** REGISTER (הרשמה) ********
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "משתמש כבר קיים עם המייל הזה" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || "user", // ברירת מחדל: משתמש רגיל
    });

    await newUser.save();

    // יצירת טוקן מיד לאחר ההרשמה
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "משתמש נרשם בהצלחה",
      token, // שולחים טוקן כדי שהמשתמש יתחבר מיד
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "שגיאת שרת", error: err.message });
  }
});

// ******** LOGIN (התחברות) ********
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "משתמש לא נמצא" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "סיסמה שגויה" });
    }

    // יצירת טוקן
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } // שיניתי ל-30 יום כדי שלא יתנתק מהר מדי
    );

    res.json({
      message: "התחברות הצליחה",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "שגיאת שרת", error: err.message });
  }
});

module.exports = router;
