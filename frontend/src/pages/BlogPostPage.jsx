const mongoose = require("mongoose");

// סכמה לתגובה (תת-מסמך בתוך הפוסט)
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorName: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String },

  // ✅ שדה חדש: האם הפוסט מאושר?
  // false = ממתין לאישור מנהל (ברירת מחדל)
  // true = מפורסם לכולם
  isApproved: { type: Boolean, default: false },

  // ✅ שדה חדש: מערך של תגובות
  comments: [commentSchema],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
