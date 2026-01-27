import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./BlogPage.css";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. שליפת פרטי המשתמש
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // בדיקות הרשאה
  const isLoggedIn = !!user;
  const isManager = user && (user.role === "admin" || user.role === "employee");

  // 2. טעינת הפוסטים מהשרת
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
        <p>טוען דיונים...</p>
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

      {/* ✅ כפתור יצירת אשכול - פתוח לכל המשתמשים המחוברים! */}
      {isLoggedIn && (
        <div
          className="discussion-actions"
          style={{
            marginBottom: "20px",
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* הערה למשתמשים רגילים */}
          {!isManager && (
            <span
              style={{
                fontSize: "0.85rem",
                color: "#666",
                background: "#f8f9fa",
                padding: "5px 10px",
                borderRadius: "15px",
                border: "1px solid #eee",
              }}
            >
              ℹ️ פוסטים של גולשים דורשים אישור מנהל לפני הפרסום
            </span>
          )}

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
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            + פתח דיון חדש
          </Link>
        </div>
      )}

      <div className="blog-grid">
        {posts.map((post) => (
          <div className="blog-card" key={post._id}>
            {/* תמונה */}
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

              <p>{post.content ? post.content.substring(0, 80) + "..." : ""}</p>

              <div
                className="card-actions"
                style={{ marginTop: "auto", display: "flex", gap: "10px" }}
              >
                <Link to={`/blog/${post._id}`} className="read-more">
                  קרא עוד
                </Link>

                {isLoggedIn && (
                  <Link
                    to={`/blog/${post._id}`} // מפנה לאותו דף, כי התגובות נמצאות שם עכשיו
                    className="read-more discussion-link"
                    style={{
                      backgroundColor: "#005f86",
                      borderColor: "#005f86",
                    }}
                  >
                    💬 תגובות ({post.comments.length})
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "40px",
              background: "#f9f9f9",
              borderRadius: "10px",
            }}
          >
            <h3>עדיין אין פוסטים כאן 🏖️</h3>
            <p>היה הראשון לפתוח דיון או לשתף חוויה!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
