// frontend/src/pages/BlogDiscussionPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function BlogDiscussionPage() {
  const { postId } = useParams();
  const [discussionTitle, setDiscussionTitle] = useState("טוען נושא...");
  const [messages, setMessages] = useState([]);

  // טעינת נתונים בהתבסס על הפוסט
  useEffect(() => {
    if (postId) {
      // נתונים פיקטיביים להדגמה
      setDiscussionTitle(`אשכול דיון לפוסט: ${postId}`);
      setMessages([
        {
          id: 1,
          user: "גולש 1",
          text: "מה דעתכם על בחירת הגלשן? יש דגמים ספציפיים מומלצים?",
          timestamp: "1 דקה לפני",
        },
        {
          id: 2,
          user: "גולשת 2",
          text: "אני חושבת שגלשן פאן-בורד רך הוא הבחירה הטובה ביותר למתחילים.",
          timestamp: "30 שניות לפני",
        },
      ]);
    }
  }, [postId]);

  return (
    <div className="discussion-page-container" style={{ padding: "20px" }}>
      <h1>{discussionTitle}</h1>
      <p>נא לשמור על שפה מכבדת. אתם מנהלים דיון על פוסט מספר {postId}.</p>

      <div
        className="discussion-messages"
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="message-bubble"
            style={{
              marginBottom: "10px",
              borderBottom: "1px dotted #eee",
              paddingBottom: "5px",
            }}
          >
            <strong>{msg.user}:</strong> {msg.text}{" "}
            <small style={{ color: "#aaa", fontSize: "0.8em" }}>
              ({msg.timestamp})
            </small>
          </div>
        ))}
      </div>

      <div className="message-input">
        <h3>הוסף תגובה</h3>
        <textarea
          placeholder="הקלד את תגובתך כאן..."
          rows="3"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
          }}
        ></textarea>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 15px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          שלח תגובה
        </button>
      </div>
    </div>
  );
}

export default BlogDiscussionPage;
