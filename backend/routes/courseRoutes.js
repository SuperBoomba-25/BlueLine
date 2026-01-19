const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protect } = require("../middleware/authMiddleware");

// ------------------
// GET – סטטיסטיקות לגרף עוגה (חדש!)
// ⚠️ חשוב מאוד: חייב להופיע *לפני* הנתיב של /:id
// ------------------
router.get("/stats", async (req, res) => {
  try {
    // 1. שליפה חכמה: מביא רק את הכותרת והמשתתפים
    // (הערה: אני מניח שלקורס יש שדה בשם 'title'. אם אצלך זה 'name', שנה כאן ל-'name')
    const courses = await Course.find({}, "title participants");

    // 2. עיבוד הנתונים לפורמט שהגרף ב-AdminPage צריך
    const stats = courses.map((course) => ({
      name: course.title, // שם הקורס (יופיע במקרא של הגרף)
      count: course.participants.length, // גודל הפרוסה בעוגה
    }));

    res.json(stats);
  } catch (err) {
    console.error("Error fetching course stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET – כל הקורסים
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET – קורס לפי ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST – הרשמה לקורס (כולל בריאות ותשלום)
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    // זיהוי המשתמש
    const userId = req.user._id || req.user.id;

    const { healthData, paymentData } = req.body; // קבלת הנתונים מהפרונט

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // בדיקה אם מלא
    if (course.participants.length >= course.maxParticipants) {
      return res.status(400).json({ message: "הקורס מלא" });
    }

    // בדיקה אם המשתמש כבר רשום
    const isEnrolled = course.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );
    if (isEnrolled) {
      return res.status(400).json({ message: "אתה כבר רשום לקורס זה" });
    }

    // יצירת המשתתף החדש
    const newParticipant = {
      userId: userId,
      healthDeclaration: {
        declared: healthData?.declared || false,
        swimming: healthData?.swimming || false,
        timestamp: new Date(),
      },
      paymentStatus: {
        paid: true,
        last4Digits: paymentData?.last4Digits || "0000",
        date: new Date(),
      },
    };

    course.participants.push(newParticipant);
    await course.save();

    res.json({ message: "נרשמת בהצלחה!", course });
  } catch (err) {
    console.error("Enrollment Error:", err);
    res.status(500).json({ message: "שגיאה בהרשמה", error: err.message });
  }
});

module.exports = router;
