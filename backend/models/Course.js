const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String, // קישור לתמונה
    level: String, // מתחילים/מתקדמים
    duration: String, // משך הקורס
    minAge: Number,
    maxAge: Number,
    maxParticipants: { type: Number, required: true },

    // מערך המשתתפים (כולל השינויים החדשים)
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        enrolledAt: { type: Date, default: Date.now },

        // --- השדות החדשים להצהרת בריאות ותשלום ---
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

    // רשימת "מה כלול" (אופציונלי)
    includes: [String],
  },
  { timestamps: true }
);

// פונקציה לבדוק אם מלא (למקרה שמשתמשים בה)
courseSchema.methods.checkIfFull = function () {
  return this.participants.length >= this.maxParticipants;
};

module.exports = mongoose.model("Course", courseSchema);
