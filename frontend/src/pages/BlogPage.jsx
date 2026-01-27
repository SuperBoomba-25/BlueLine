import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./BlogPage.css";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // בדיקת התחברות
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!user;

  // ניהול המודל (החלון הקופץ) לכתיבת פוסט
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: "" });

  // טעינת הפוסטים (מביא רק את המאושרים באופן אוטומטי)
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

  // פונקציה לשליחת פוסט חדש
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post("/blog", newPost);

      // הודעה למשתמש + סגירת המודל
      alert(
        "הפוסט נשלח בהצלחה וממתין לאישור מנהל! ⏳\nהוא יופיע באתר לאחר הבדיקה."
      );
      setShowModal(false);
      setNewPost({ title: "", content: "", image: "" });
    } catch (err) {
      alert(
        "שגיאה ביצירת הפוסט: " + (err.response?.data?.message || err.message)
      );
    }
  };

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
    <div
      className="blog-container"
      style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}
    >
      {/* כותרת */}
      <div
        className="blog-header"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <h1>בלוג הגולשים 🌊</h1>
        <p>כאן תמצאו כתבות, טיפים, מדריכים וחוויות מהעולם המופלא של הגלישה</p>
      </div>

      {/* כפתור פתיחת דיון (פותח מודל) */}
      <div
        className="discussion-actions"
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* הודעת מידע לכולם */}
        <span
          style={{
            fontSize: "0.9rem",
            color: "#666",
            background: "#f1f1f1",
            padding: "8px 15px",
            borderRadius: "20px",
          }}
        >
          ℹ️ פוסטים חדשים עולים לאחר אישור צוות האתר
        </span>

        {isLoggedIn ? (
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            + פתח דיון חדש
          </button>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "#888" }}>
            התחבר כדי לכתוב פוסט
          </p>
        )}
      </div>

      {/* רשימת הפוסטים */}
      <div
        className="blog-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {posts.map((post) => (
          <div
            className="blog-card"
            key={post._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* תמונה */}
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  height: "200px",
                  background: "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                }}
              >
                🌊
              </div>
            )}

            <div
              className="blog-content"
              style={{
                padding: "20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                {post.title}
              </h3>

              <div
                className="post-meta"
                style={{
                  fontSize: "0.85rem",
                  color: "#777",
                  marginBottom: "15px",
                }}
              >
                <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                <span style={{ margin: "0 10px" }}>|</span>
                <span>👤 {post.authorName}</span>
              </div>

              <p style={{ flex: 1, color: "#555", lineHeight: "1.5" }}>
                {post.content ? post.content.substring(0, 80) + "..." : ""}
              </p>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link
                  to={`/blog/${post._id}`}
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    fontWeight: "bold",
                  }}
                >
                  קרא עוד ⬅️
                </Link>

                <span style={{ fontSize: "0.9rem", color: "#666" }}>
                  💬 {post.comments ? post.comments.length : 0} תגובות
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            background: "#f9f9f9",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <h3>עדיין אין פוסטים כאן 🏖️</h3>
          <p>היה הראשון לפתוח דיון או לשתף חוויה!</p>
        </div>
      )}

      {/* === המודל (Pop-up) לכתיבת פוסט === */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ marginTop: 0, textAlign: "center" }}>📝 פוסט חדש</h2>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.9rem",
                color: "#666",
                marginBottom: "20px",
              }}
            >
              הפוסט יישלח לאישור מנהל לפני הפרסום.
            </p>

            <form
              onSubmit={handleCreatePost}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                placeholder="כותרת הפוסט"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                required
                style={{
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />

              <textarea
                placeholder="תוכן הפוסט..."
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                required
                rows="6"
                style={{
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  resize: "vertical",
                }}
              />

              <input
                type="text"
                placeholder="קישור לתמונה (אופציונלי)"
                value={newPost.image}
                onChange={(e) =>
                  setNewPost({ ...newPost, image: e.target.value })
                }
                style={{
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  שלח לאישור
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
