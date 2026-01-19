import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // חיבור לשרת
import "./BlogPage.css";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. שליפת פרטי המשתמש מה-Local Storage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // 2. בדיקות הרשאה
  const isLoggedIn = !!user; // האם מחובר? (בשביל לראות/להגיב בדיונים)

  const canCreatePost =
    user && (user.role === "admin" || user.role === "employee");

  // 3. טעינת הפוסטים מהשרת
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/blog");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div
        className="blog-container"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <p>טוען פוסטים...</p>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div
        className="blog-header"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <h1>בלוג הגולשים 🌊</h1>
        <p>כאן תמצאו כתבות, טיפים, מדריכים וחוויות מהעולם המופלא של הגלישה</p>
      </div>

      {/* ✅ כפתור יצירת אשכול חדש - מוצג רק למנהלים ועובדים! */}
      {canCreatePost && (
        <div
          className="discussion-actions"
          style={{ marginBottom: "20px", textAlign: "right" }}
        >
          <Link
            to="/discussion/new"
            className="create-thread-button"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            + יצירת אשכול דיון חדש
          </Link>
        </div>
      )}

      <div className="blog-grid">
        {posts.map((post) => (
          <div className="blog-card" key={post._id}>
            {/* תמונה (אם קיימת) */}
            {post.image ? (
              <img src={post.image} alt={post.title} className="blog-image" />
            ) : (
              <div className="blog-image-placeholder">🌊</div>
            )}

            <div className="blog-content">
              <h3>{post.title}</h3>

              <div
                className="post-meta"
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                <span style={{ marginRight: "10px" }}>
                  👤 {post.authorName || "מערכת"}
                </span>
              </div>

              <p>
                {post.content ? post.content.substring(0, 100) + "..." : ""}
              </p>

              <div
                className="card-actions"
                style={{ marginTop: "auto", display: "flex", gap: "10px" }}
              >
                {/* 1. קישור לקריאת הפוסט המלא */}
                <Link to={`/blog/${post._id}`} className="read-more">
                  קרא עוד
                </Link>

                {/* 2. קישור לדיון - פתוח לכל המשתמשים הרשומים */}
                {isLoggedIn && (
                  <Link
                    to={`/blog/discussion/${post._id}`}
                    className="read-more discussion-link"
                    style={{
                      backgroundColor: "#005f86",
                      borderColor: "#005f86",
                    }}
                  >
                    💬 הצטרף לדיון
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p style={{ textAlign: "center", gridColumn: "1/-1" }}>
            עדיין אין פוסטים בבלוג. מנהלים יכולים להוסיף פוסטים דרך פאנל הניהול
            או דרך הכפתור למעלה.
          </p>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
