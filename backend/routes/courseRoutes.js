const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protect } = require("../middleware/authMiddleware");

// GET stats
router.get("/stats", async (req, res) => {
  try {
    const courses = await Course.find({}, "title participants");
    const stats = courses.map((course) => ({
      name: course.title,
      count: course.participants
        ? course.participants.filter((p) => p.status === "approved").length
        : 0,
    }));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all (עם שמות!)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "participants.userId",
      "name email"
    );
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new course
router.post("/", protect, async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update course
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE course
router.delete("/:id", protect, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "participants.userId",
      "name email"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { healthData, paymentData } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isEnrolled = course.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );
    if (isEnrolled)
      return res.status(400).json({ message: "אתה כבר רשום לקורס זה" });

    course.participants.push({
      userId: userId,
      status: "pending", // ✅
      healthDeclaration: { ...healthData, timestamp: new Date() },
      paymentStatus: { ...paymentData, date: new Date(), paid: true },
    });

    await course.save();
    res.json({
      message: "בקשת ההרשמה לקורס התקבלה וממתינה לאישור! ⏳",
      course,
    });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בהרשמה", error: err.message });
  }
});

// ✅ נתיב חדש: ניהול סטטוס נרשמים לקורס
router.put("/:id/participants/:userId", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const course = await Course.findById(req.params.id);

    const participant = course.participants.find(
      (p) => p.userId.toString() === req.params.userId
    );
    if (!participant)
      return res.status(404).json({ message: "User not found in course" });

    participant.status = status;
    await course.save();

    const populatedCourse = await Course.findById(req.params.id).populate(
      "participants.userId",
      "name email"
    );
    res.json(populatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
