const express = require("express");
const router = express.Router();
const Trip = require("../models/Trips");

const { protect } = require("../middleware/authMiddleware");

// GET – כל הטיולים

router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------
// GET – טיול לפי ID
// ------------------
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// POST – הרשמה לטיול (מעודכן עם בריאות ותשלום)
// ------------------
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    // קבלת המידע מהמשתמש המחובר
    const userId = req.user._id;

    // קבלת המידע החדש מהטופס (בריאות ותשלום)
    const { healthData, paymentData } = req.body;

    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // אם הטיול מלא
    if (trip.participants.length >= trip.maxParticipants) {
      return res.status(400).json({ message: "הטיול מלא ואין מקומות פנויים" });
    }

    // אם המשתמש כבר רשום
    const already = trip.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );
    if (already) {
      return res.status(400).json({ message: "אתה כבר רשום לטיול הזה" });
    }

    // יצירת אובייקט המשתתף החדש
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

    // הוספת המשתמש ושמירה
    trip.participants.push(newParticipant);

    // אם יש פונקציה לבדיקת מלאות במודל
    if (typeof trip.checkIfFull === "function") {
      trip.checkIfFull();
    }

    await trip.save();

    res.json({ message: "נרשמת לטיול בהצלחה!", trip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// GET – בדיקת סטטוס מלא/פנוי
// ------------------
router.get("/:id/status", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const isFull = trip.participants.length >= trip.maxParticipants;

    res.json({
      isFull,
      participants: trip.participants.length,
      maxParticipants: trip.maxParticipants,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
