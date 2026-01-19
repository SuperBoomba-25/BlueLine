const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorName: { type: String, required: true }, // שם הכותב
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // קישור למשתמש (אופציונלי)
  image: { type: String }, // כתובת תמונה
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
