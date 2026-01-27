import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // ✅ שימוש נכון בחיבור לשרת
import "./BlogPage.css";

function BlogPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!user;
  const isManager = user && (user.role === "admin" || user.role === "employee");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/blog/${postId}/comments`, {
        content: commentText,
      });
      setPost(res.data);
      setCommentText("");
    } catch (err) {
      alert("שגיאה בהוספת תגובה");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("למחוק את התגובה?")) return;
    try {
      const res = await api.delete(`/blog/${postId}/comments/${commentId}`);
      setPost(res.data);
    } catch (err) {
      alert("שגיאה במחיקת תגובה");
    }
  };

  if (loading) return <div className="blog-container">טוען...</div>;
  if (!post) return <div className="blog-container">הפוסט לא נמצא</div>;

  return (
    <div
      className="blog-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
    >
      <button
        onClick={() => navigate("/blog")}
        style={{ marginBottom: "20px", cursor: "pointer" }}
      >
        ⬅️ חזרה לפורום
      </button>

      <div className="blog-card full-post">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        <div className="blog-content">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>מאת: {post.authorName}</span>
          </div>
          <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        </div>
      </div>

      <div className="comments-section" style={{ marginTop: "40px" }}>
        <h3>💬 תגובות ({post.comments ? post.comments.length : 0})</h3>

        {post.comments &&
          post.comments.map((comment) => (
            <div
              key={comment._id}
              className="comment"
              style={{
                background: "#f9f9f9",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <strong>{comment.userName}</strong>: {comment.content}
              {isManager && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  style={{ color: "red", marginLeft: "10px" }}
                >
                  מחק
                </button>
              )}
            </div>
          ))}

        {isLoggedIn ? (
          <form onSubmit={handleAddComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button type="submit">שלח תגובה</button>
          </form>
        ) : (
          <p>התחבר כדי להגיב</p>
        )}
      </div>
    </div>
  );
}

export default BlogPostPage;
