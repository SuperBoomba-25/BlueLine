const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const { protect } = require("../middleware/authMiddleware");

// GET - קבלת פוסטים
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    let query = {};
    if (!showAll) {
      query = { isApproved: true };
    }
    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET - פוסט בודד
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - יצירת פוסט
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const isStaff = req.user.role === "admin" || req.user.role === "employee";

    const newPost = new BlogPost({
      title,
      content,
      image,
      authorName: req.user.name,
      authorId: req.user._id,
      isApproved: isStaff ? true : false,
      comments: [],
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - אישור פוסט
router.put("/:id/approve", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - תגובה
router.post("/:id/comments", protect, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      userId: req.user._id,
      userName: req.user.name,
      content: content,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - מחיקת תגובה
router.delete("/:id/comments/:commentId", protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - מחיקת פוסט
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isAuthorized =
      req.user.role === "admin" ||
      req.user.role === "employee" ||
      post.authorId.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ message: "Post removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
