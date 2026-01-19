const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // המלצה: עדיף bcryptjs למניעת בעיות תאימות, אבל גם bcrypt זה בסדר

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ כאן השינוי החשוב: הוספנו את "employee"
  role: {
    type: String,
    enum: ["user", "employee", "admin"],
    default: "user",
  },

  isBanned: { type: Boolean, default: false }, // שדה לחסימת משתמשים (טוב לאדמין)
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// הצפנת סיסמה לפני שמירה
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// השוואת סיסמה
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
