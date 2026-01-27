const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const { protect } = require("../middleware/authMiddleware");

// ----------------------------------------------------
// GET - קבלת פוסטים (עם סינון חכם)
// ----------------------------------------------------
router.get("/", async (req, res) => {
  try {
    // אם נשלח בבקשה ?all=true (עבור האדמין), נביא הכל.
    // אחרת (עבור הגולשים), נביא רק את המאושרים.
    const showAll = req.query.all === "true";

    let query = {};
    if (!showAll) {
      query = { isApproved: true };
    }

    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// GET - קבלת פוסט בודד לפי ID (כולל תגובות)
// ----------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // אופציונלי: אפשר להוסיף כאן בדיקה אם הפוסט מאושר, אבל לרוב נרצה לתת לכותב לראות את הפוסט שלו גם אם טרם אושר
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// POST - יצירת פוסט חדש
// ----------------------------------------------------
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    // בדיקה: האם המשתמש הוא מצוות האתר? (admin או employee)
    const isStaff = req.user.role === "admin" || req.user.role === "employee";

    const newPost = new BlogPost({
      title,
      content,
      image,
      authorName: req.user.name,
      authorId: req.user._id,
      // אם זה איש צוות -> מאושר אוטומטית. אם גולש -> ממתין לאישור.
      isApproved: isStaff ? true : false,
      comments: [],
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ----------------------------------------------------
// PUT - אישור פוסט (לאדמין/עובד בלבד) - ✅ חדש!
// ----------------------------------------------------
router.put("/:id/approve", protect, async (req, res) => {
  try {
    // רק לצוות מותר לאשר
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.isApproved = true;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// POST - הוספת תגובה לפוסט - ✅ חדש!
// ----------------------------------------------------
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

    res.status(201).json(post); // מחזיר את הפוסט המעודכן
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// DELETE - מחיקת תגובה (מודרציה) - ✅ חדש!
// ----------------------------------------------------
router.delete("/:id/comments/:commentId", protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // מחיקת התגובה מהמערך
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// DELETE - מחיקת פוסט שלם
// ----------------------------------------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // הרשאה: רק אדמין, עובד, או הכותב המקורי יכולים למחוק
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
