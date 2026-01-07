const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    description: String,
    date: Date,
    price: { type: Number, required: true },
    image: String,
    maxParticipants: { type: Number, required: true },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
