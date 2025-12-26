// ------------------
// POST – הרשמה לטיול (רק משתמש מחובר)
// ------------------
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // אם הטיול מלא
    if (trip.participants.length >= trip.maxParticipants) {
      return res.status(400).json({ message: "הטיול מלא ואין מקומות פנויים" });
    }

    // אם המשתמש כבר רשום
    const already = trip.participants.some(
      (p) => p.userId.toString() === userId
    );

    if (already) {
      return res.status(400).json({ message: "אתה כבר רשום לטיול הזה" });
    }

    // הוספת המשתמש
    trip.participants.push({ userId });
    trip.checkIfFull();
    await trip.save();

    res.json({
      message: "נרשמת בהצלחה!",
      trip,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
