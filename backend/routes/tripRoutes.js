const express = require("express");
const router = express.Router();
const Trip = require("../models/Trips");
const { protect } = require("../middleware/authMiddleware");

// GET stats
router.get("/stats", async (req, res) => {
  try {
    const trips = await Trip.find({}, "destination participants");
    const stats = trips.map((trip) => ({
      name: trip.destination || "יעד לא ידוע",
      // סופרים רק את המאושרים לסטטיסטיקה (אופציונלי, אפשר לספור את כולם)
      count: trip.participants
        ? trip.participants.filter((p) => p.status === "approved").length
        : 0,
    }));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all (כולל פרטי משתמשים!)
router.get("/", async (req, res) => {
  try {
    // ✅ populate מביא את השם והאימייל של המשתמשים
    const trips = await Trip.find().populate(
      "participants.userId",
      "name email"
    );
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new trip
router.post("/", protect, async (req, res) => {
  try {
    const newTrip = new Trip({ ...req.body, participants: [] });
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update trip
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE trip
router.delete("/:id", protect, async (req, res) => {
  try {
    await Trip.deleteOne({ _id: req.params.id });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single trip
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "participants.userId",
      "name email"
    );
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll (הרשמה - כברירת מחדל ממתין)
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const { healthData, paymentData } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Not found" });

    // בדיקה אם המשתמש כבר רשום (לא משנה באיזה סטטוס)
    const already = trip.participants.some(
      (p) => p.userId.toString() === req.user._id.toString()
    );
    if (already)
      return res.status(400).json({ message: "אתה כבר רשום לטיול זה" });

    trip.participants.push({
      userId: req.user._id,
      status: "pending", // ✅ נכנס כממתין
      healthDeclaration: { ...healthData, timestamp: new Date() },
      paymentStatus: { ...paymentData, date: new Date(), paid: true }, // שילם, אבל ממתין לאישור
    });

    await trip.save();
    res.json({ message: "בקשת ההרשמה התקבלה וממתינה לאישור! ⏳", trip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ נתיב חדש: ניהול סטטוס משתתף (אישור/דחייה)
router.put("/:id/participants/:userId", protect, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const trip = await Trip.findById(req.params.id);

    const participant = trip.participants.find(
      (p) => p.userId.toString() === req.params.userId
    );
    if (!participant)
      return res.status(404).json({ message: "User not found in trip" });

    participant.status = status;
    await trip.save();

    // מחזירים את הטיול המעודכן עם פרטי המשתמשים כדי שהטבלה באדמין תתעדכן
    const populatedTrip = await Trip.findById(req.params.id).populate(
      "participants.userId",
      "name email"
    );
    res.json(populatedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
