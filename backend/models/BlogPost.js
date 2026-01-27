const mongoose = require("mongoose");

// סכמה לתגובה
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// סכמה לפוסט
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorName: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String },
  isApproved: { type: Boolean, default: false },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

// ייצוא המודל - שים לב שאין סוגריים {} סביב הייצוא!
const BlogPost = mongoose.model("BlogPost", blogPostSchema);
module.exports = BlogPost;
