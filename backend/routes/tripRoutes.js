const express = require("express");
const router = express.Router();
const Trip = require("../models/Trips");
const { protect } = require("../middleware/authMiddleware");

// ------------------
// GET – סטטיסטיקות לגרפים
// ------------------
router.get("/stats", async (req, res) => {
  try {
    const trips = await Trip.find({}, "destination participants");

    const stats = trips.map((trip) => ({
      name: trip.destination || "יעד לא ידוע",
      count: trip.participants ? trip.participants.length : 0,
    }));

    res.json(stats);
  } catch (err) {
    console.error("Error fetching trip stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// GET – כל הטיולים
// ------------------
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------
// POST – יצירת טיול חדש (למנהל)
// ------------------
router.post("/", protect, async (req, res) => {
  try {
    const { destination, date, price, description, image, maxParticipants } =
      req.body;

    const newTrip = new Trip({
      destination,
      date,
      price,
      description,
      image,
      maxParticipants,
      participants: [],
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// PUT – עריכת טיול (חדש!) ✅
// ------------------
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // מחזיר את האובייקט המעודכן
    );

    if (!updatedTrip)
      return res.status(404).json({ message: "Trip not found" });

    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------
// DELETE – מחיקת טיול (למנהל)
// ------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    await Trip.deleteOne({ _id: req.params.id });
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
// POST – הרשמה לטיול
// ------------------
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { healthData, paymentData } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.participants.length >= trip.maxParticipants) {
      return res.status(400).json({ message: "הטיול מלא ואין מקומות פנויים" });
    }

    const already = trip.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );
    if (already) {
      return res.status(400).json({ message: "אתה כבר רשום לטיול הזה" });
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

    trip.participants.push(newParticipant);

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
// GET – סטטוס הרשמה
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
