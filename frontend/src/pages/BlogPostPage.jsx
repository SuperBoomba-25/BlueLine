// frontend/src/pages/BlogPostPage.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";

function BlogPostPage() {
  const { postId } = useParams();

  // כאן תתבצע קריאת API שתביא את הבלוג המלא (title, full_content, author)
  // לפי ה-postId.

  // נתונים פיקטיביים להדגמה
  const dummyPost = {
    title: `פוסט בלוג מלא: ${postId}`,
    author: "אלון גולש",
    fullContent: `זהו התוכן המלא והמפורט של פוסט מספר ${postId}. 
                  כאן תופיע הכתבה המעמיקה על בחירת גלשנים או על טיולי גלישה. 
                  בשלב זה אנו משתמשים בתוכן דמה כדי לאשר שהניתוב עובד כראוי.`,
    date: "20 באוגוסט 2025",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/blog" style={{ textDecoration: "none", color: "#007bff" }}>
        ← חזרה לבלוג
      </Link>
      <h1>{dummyPost.title}</h1>
      <p
        style={{
          color: "#666",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        מאת: {dummyPost.author} | תאריך: {dummyPost.date}
      </p>
      <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
        {dummyPost.fullContent}
      </div>
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <Link
          to={`/blog/discussion/${postId}`}
          style={{
            backgroundColor: "#005f86",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
          }}
        >
          עבור לאשכול דיון
        </Link>
      </div>
    </div>
  );
}

export default BlogPostPage;
