import { useEffect, useState } from "react";

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000); // עדכון כל דקה
    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours();
  const date = time.toLocaleDateString("he-IL");
  const currentTime = time.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let greeting = "שלום";
  let emoji = "🌊";
  let bgColor = "#f2f4f8";

  if (hour >= 5 && hour < 12) {
    greeting = "בוקר טוב";
    emoji = "☀";
    bgColor = "#e0f7fa";
  } else if (hour >= 12 && hour < 18) {
    greeting = "צהריים טובים";
    emoji = "🌇";
    bgColor = "#fff3e0";
  } else {
    greeting = "ערב טוב";
    emoji = "🌙";
    bgColor = "#ede7f6";
  }

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <h2>ברוך הבא ל־BlueLine {emoji}</h2>

      {user ? (
        <>
          <p>
            {greeting}, {user.name}! שמחים לראות אותך שוב 🏄‍♂
          </p>
          <p>📅 תאריך: {date}</p>
          <p>⏰ שעה נוכחית: {currentTime}</p>
        </>
      ) : (
        <p>ברוך הבא אורח – נא להתחבר או להירשם</p>
      )}

      <hr />

      <h3>🌊 תנאי הים של היום</h3>
      <p>
        גובה הגלים: <em>בקרוב...</em>
      </p>
      <p>
        כיוון רוח: <em>בקרוב...</em>
      </p>

      <hr />

      <h3>🔗 קישורים נוספים</h3>
      <ul>
        <li>
          <a href="/courses">🎓 קורסים לגלישה</a>
        </li>
        <li>
          <a href="/blog">📰 בלוג גולשים</a>
        </li>
        <li>
          <a href="/trips">🌴 טיולי גלישה</a>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
