const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost"); // וודא שהשם תואם לקובץ שיצרת בשלב 1
const { protect } = require("../middleware/authMiddleware");

// GET - קבלת כל הפוסטים (פתוח לכולם)
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 }); // מהחדש לישן
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - יצירת פוסט חדש (למשתמשים רשומים/מנהלים)
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const newPost = new BlogPost({
      title,
      content,
      image,
      authorName: req.user.name, // לוקח את השם מהמשתמש המחובר
      authorId: req.user._id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - מחיקת פוסט (למנהלים בלבד - או לכותב הפוסט)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // בדיקה: האם המוחק הוא אדמין או הכותב של הפוסט?
    if (
      req.user.role !== "admin" &&
      post.authorId.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ message: "Post removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
