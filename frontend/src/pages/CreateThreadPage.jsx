import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ חיבור לשרת

function CreateThreadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // ✅ הוספת שדה תמונה
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // שליחת הנתונים לשרת
      await api.post("/blog", {
        title,
        content,
        image,
      });

      // בדיקת תפקיד המשתמש כדי לתת הודעה מתאימה
      const user = JSON.parse(localStorage.getItem("user"));
      const isManager =
        user && (user.role === "admin" || user.role === "employee");

      if (isManager) {
        alert("הדיון פורסם בהצלחה! ✅");
      } else {
        alert("הדיון נשלח לאישור מנהל ויפורסם בקרוב ⏳");
      }

      navigate("/blog"); // חזרה לבלוג
    } catch (err) {
      console.error("Failed to create post:", err);
      alert(
        "שגיאה ביצירת הפוסט: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "40px auto",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>📝 יצירת דיון חדש</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
        שתף את הקהילה בשאלות, חוויות או טיפים.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            כותרת הנושא:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
            placeholder="על מה הדיון?"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            תוכן ההודעה:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              height: "150px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
            }}
            required
            placeholder="פרט כאן את תוכן ההודעה..."
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            קישור לתמונה (אופציונלי):
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            fontSize: "1.1rem",
            fontWeight: "bold",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "שולח..." : "פרסם אשכול"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/blog")}
          style={{
            width: "100%",
            marginTop: "10px",
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
          }}
        >
          ביטול וחזרה
        </button>
      </form>
    </div>
  );
}

export default CreateThreadPage;
