// frontend/src/pages/BlogPage.jsx

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
// ✅ ייבוא Link כדי שנוכל להשתמש בקישורים
import { Link } from "react-router-dom";
import "./BlogPage.css";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ בדיקה אם המשתמש מחובר
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user; // יהיה true אם יש משתמש

  useEffect(() => {
    // פוסטים מדומים לדוגמה
    const dummyPosts = [
      {
        id: 1,
        title: "איך לבחור את הגלשן הראשון שלך?",
        description:
          "המדריך השלם לבחירת גלשן למתחילים: סוגים, גובה, חומרי גלם ומה חשוב לדעת לפני הרכישה הראשונה שלך.",
        image: "/images/blog1.jpg",
        date: "20 באוגוסט 2025",
      },
      {
        id: 2,
        title: "5 חופים מומלצים לגלישה בישראל",
        description:
          "מכפר שלם ועד אשקלון – החופים הכי טובים למתחילים ומתקדמים כולל תנאים, גישה ומתי הכי כדאי לבוא.",
        image: "/images/blog2.jpg",
        date: "15 באוגוסט 2025",
      },
      {
        id: 3,
        title: "מה כדאי לדעת לפני טיול גלישה בחו״ל?",
        description:
          "בדיקת תנאי ים, ביטוחים, ציוד והשכרת גלשנים – כל הטיפים החיוניים לגלישת חו״ל בטוחה ומהנה.",
        image: "/images/blog3.jpg",
        date: "8 באוגוסט 2025",
      },
    ];

    setPosts(dummyPosts);

    // 🔗 התחברות ל־Socket.IO
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🔗 חיבור ל־Socket הצליח מהבלוג!");
    });

    // 🧹 Cleanup בעת סגירת הקומפוננטה
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="blog-container">
      <h1>בלוג הגולשים</h1>
      <p>כאן תמצאו כתבות, טיפים, מדריכים וחוויות מהעולם המופלא של הגלישה</p>

      <div className="blog-grid">
        {posts.map((post) => (
          // ✅ שמירה על מבנה ה-<div> המקורי
          <div className="blog-card" key={post.id}>
            <img src={post.image} alt={post.title} className="blog-image" />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p className="blog-date">📅 {post.date}</p>
              <p>{post.description}</p>

              {/* ✅ 1. קישור "קרא עוד" רגיל (כניסה לבלוג) */}
              <Link to={`/blog/${post.id}`} className="read-more">
                קרא עוד
              </Link>

              {/* ✅ 2. הקישור המותנה לדיון (רק למחוברים) */}
              {isLoggedIn && (
                <Link
                  to={`/blog/discussion/${post.id}`}
                  className="read-more discussion-link"
                  // שינוי קטן ב-CSS כדי להבדיל אותו ויזואלית
                  style={{ marginRight: "10px", backgroundColor: "#005f86" }}
                >
                  אשכול דיון
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
