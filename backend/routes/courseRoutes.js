const express = require("express");
const router = express.Router();
// עכשיו הקובץ הזה באמת קיים, אז השורה הזו תעבוד:
const Course = require("../models/Course");
const { protect } = require("../middleware/authMiddleware"); // וודא שהנתיב ל-middleware נכון אצלך

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
    // זיהוי המשתמש (תלוי איך ה-middleware שלך בנוי, בד"כ זה req.user._id או req.user.id)
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
