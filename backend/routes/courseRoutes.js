const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protect } = require(".s./middleware/authMiddleware");

// ------------------
// GET – סטטיסטיקות לגרף עוגה
// ------------------
router.get("/stats", async (req, res) => {
  try {
    const courses = await Course.find({}, "title participants");

    const stats = courses.map((course) => ({
      // מונע קריסה אם אין כותרת
      name: course.title || "קורס ללא שם",
      count: course.participants ? course.participants.length : 0,
    }));

    res.json(stats);
  } catch (err) {
    console.error("Error fetching course stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// GET – כל הקורסים
// ------------------
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------
// POST – יצירת קורס חדש (למנהל)
// ------------------
router.post("/", protect, async (req, res) => {
  try {
    // הנחה שאלו השדות במודל Course שלך
    const { title, description, price, startDate, image, maxParticipants } =
      req.body;

    const newCourse = new Course({
      title,
      description,
      price,
      startDate,
      image,
      maxParticipants,
      participants: [],
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// DELETE – מחיקת קורס (למנהל)
// ------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await Course.deleteOne({ _id: req.params.id });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// GET – קורס לפי ID
// ------------------
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// POST – הרשמה לקורס
// ------------------
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { healthData, paymentData } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.participants.length >= course.maxParticipants) {
      return res.status(400).json({ message: "הקורס מלא" });
    }

    const isEnrolled = course.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );
    if (isEnrolled) {
      return res.status(400).json({ message: "אתה כבר רשום לקורס זה" });
    }

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
