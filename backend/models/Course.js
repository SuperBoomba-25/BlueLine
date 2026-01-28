const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    level: String,
    duration: String,
    minAge: Number,
    maxAge: Number,
    maxParticipants: { type: Number, required: true },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        enrolledAt: { type: Date, default: Date.now },
        // ✅ שדה חדש לניהול סטטוס
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        healthDeclaration: {
          declared: { type: Boolean, default: false },
          swimming: { type: Boolean, default: false },
          timestamp: Date,
        },
        paymentStatus: {
          paid: { type: Boolean, default: false },
          last4Digits: String,
          date: Date,
        },
      },
    ],
    includes: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
