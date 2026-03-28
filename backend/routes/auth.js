const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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
      role: role || "user",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "משתמש נרשם בהצלחה",
      token,
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

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
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

// ******** FORGOT PASSWORD (שכחתי סיסמה) ********
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "לא נמצא משתמש עם האימייל הזה" });
    }

    // 1. יצירת טוקן רנדומלי
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 2. שמירת הטוקן וזמן תפוגה (15 דקות) במסד הנתונים
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    // 3. הגדרת nodemailer לשליחת המייל
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // האימייל של המערכת שמוגדר ב-.env
        pass: process.env.EMAIL_PASS, // סיסמת האפליקציה שמוגדרת ב-.env
      },
    });

    // 4. הלינק שיישלח למשתמש (מפנה לצד הלקוח - React)
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "🌊 איפוס סיסמה למערכת BlueLine",
      html: `
        <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
          <h2>שלום ${user.name},</h2>
          <p>ביקשת לאפס את הסיסמה שלך במערכת BlueLine.</p>
          <p>לחץ על הכפתור למטה כדי להגדיר סיסמה חדשה (הלינק תקף ל-15 דקות):</p>
          <br>
          <a href="${resetUrl}" style="background-color: #0077b6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">לאיפוס הסיסמה לחץ כאן</a>
          <br><br>
          <p>אם לא ביקשת לאפס את הסיסמה, אנא התעלם מהודעה זו.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "לינק לאיפוס סיסמה נשלח למייל שלך! 📧" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    // במקרה של שגיאה בשליחת המייל, ננקה את הטוקן מהמסד
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    res.status(500).json({
      message: "שגיאה בשליחת המייל, אנא נסה שוב מאוחר יותר",
      error: err.message,
    });
  }
});

// ******** RESET PASSWORD (הגדרת סיסמה חדשה) ********
router.post("/reset-password/:token", async (req, res) => {
  try {
    // מציאת המשתמש לפי הטוקן ובדיקה שהטוקן עדיין לא פג תוקף
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "הלינק לא חוקי או שפג תוקפו. אנא בקש לינק איפוס חדש.",
      });
    }

    // עדכון הסיסמה
    user.password = req.body.password;

    // מחיקת הטוקן (הוא כבר נוצל)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // כאן ה-pre('save') שיש לכם במודל ייכנס לפעולה ויצפין את הסיסמה החדשה!
    await user.save();

    res.json({
      message: "הסיסמה שונתה בהצלחה! אפשר להתחבר עכשיו עם הסיסמה החדשה.",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "שגיאת שרת", error: err.message });
  }
});

module.exports = router;
