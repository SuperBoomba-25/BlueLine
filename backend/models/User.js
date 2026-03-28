const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // תפקידים: משתמש רגיל, עובד, מנהל
  role: {
    type: String,
    enum: ["user", "employee", "admin"],
    default: "user",
  },

  isBanned: { type: Boolean, default: false },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },

  // ✅ השדות החדשים עבור מערכת "שכחתי סיסמה"
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// הצפנת סיסמה לפני שמירה
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// פונקציה להשוואת סיסמה (עבור הלוגין)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
