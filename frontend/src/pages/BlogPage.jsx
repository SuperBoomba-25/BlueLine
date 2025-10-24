// frontend/src/pages/BlogPage.jsx

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
// ✅ ייבוא Link כדי לאפשר ניווט מתוך הקארד
import { Link } from "react-router-dom";
import "./BlogPage.css";

function BlogPage() {
  const [posts, setPosts] = useState([]);

  // ✅ בדיקה אם המשתמש מחובר
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user; // יהיה true אם יש משתמש

  useEffect(() => {
    // ... הקוד הקיים של dummyPosts
    const dummyPosts = [
      // ... פוסטים קיימים ...
    ];

    setPosts(dummyPosts);

    // 🔗 התחברות ל־Socket.IO
    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("🔗 חיבור ל־Socket הצליח מהבלוג!");
    });

    // 🧹 Cleanup בעת סגירת הקומפוננטה
    return () => {
      newSocket.disconnect();
    };
  }, []); // ריצה פעם אחת בלבד בטעינת הקומפוננטה

  return (
    <div className="blog-container">
      <h1>📰 בלוג הגולשים</h1>
      <p>כאן תמצאו כתבות, טיפים, מדריכים וחוויות מהעולם המופלא של הגלישה 🌊</p>

      <div className="blog-grid">
        {posts.map((post) => (
          <div className="blog-card" key={post.id}>
            <img src={post.image} alt={post.title} className="blog-image" />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p className="blog-date">📅 {post.date}</p>
              <p>{post.description}</p>

              {/* ✅ הוספת הקישור המותנה: */}
              {isLoggedIn ? (
                // קישור דינמי לנתיב שנגדיר ב-App.js
                <Link
                  to={`/blog/discussion/${post.id}`}
                  className="read-more discussion-link"
                >
                  💬 אשכול דיון
                </Link>
              ) : (
                <button className="read-more">קרא עוד</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
