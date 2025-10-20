import { useState, useEffect } from "react";
import { io } from "socket.io-client"; // ✅ ייבוא Socket.IO Client
import "./BlogPage.css";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null); // שמירה על החיבור ב־state אם צריך

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
    const newSocket = io("http://localhost:5000"); // כתובת ה־backend שלך
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🔗 חיבור ל־Socket הצליח מהבלוג!");
    });

    // אם יש אירועים נוספים מהשרת, אפשר להאזין כאן
    // newSocket.on("newMessage", (data) => { console.log("📩 הודעה חדשה:", data); });

    // 🧹 Cleanup בעת סגירת הקומפוננטה
    return () => {
      newSocket.disconnect();
    };
  }, []);

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
              <button className="read-more">קרא עוד</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
