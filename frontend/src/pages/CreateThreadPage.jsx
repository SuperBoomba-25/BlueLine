// frontend/src/pages/CreateThreadPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateThreadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("אשכול חדש נוצר:", { title, content });
    // כאן תבוא קריאת ה-API לשרת לשמירת האשכול
    navigate("/blog"); // חזרה לבלוג לאחר סיום
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>יצירת אשכול דיון חדש</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>כותרת הנושא:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>תוכן ההודעה:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", height: "150px", padding: "8px" }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          פרסם אשכול
        </button>
      </form>
    </div>
  );
}

export default CreateThreadPage;
