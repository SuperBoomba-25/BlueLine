import { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [time, setTime] = useState(new Date());
  const [waveData, setWaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const latitude = 32.08; // תל אביב
  const longitude = 34.78;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const getFormattedDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      const formattedDate = getFormattedDate();
      console.log("📅 תאריך שנשלח ל־API:", formattedDate);

      try {
        const res = await axios.get(
          "https://marine-api.open-meteo.com/v1/marine",
          {
            params: {
              latitude,
              longitude,
              hourly: "wave_height,wave_period,sea_surface_temperature",
              start_date: formattedDate,
              end_date: formattedDate,
            },
          }
        );

        setWaveData(res.data.hourly);
      } catch (error) {
        console.error("שגיאה בטעינת תחזית הים:", error);
        setError(error.response ? error.response.data : "שגיאה לא ידועה");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const getCurrentSeaCondition = () => {
    if (!waveData) return null;

    const currentHourISO = time.toISOString().slice(0, 13); // YYYY-MM-DDTHH
    const index = waveData.time.findIndex((t) => t.startsWith(currentHourISO));

    if (index === -1) return null;

    return {
      height: waveData.wave_height[index],
      seaSurfaceTemp: waveData.sea_surface_temperature[index],
      wavePeriod: waveData.wave_period[index],
    };
  };

  const sea = getCurrentSeaCondition();

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
      {loading ? (
        <p>טוען נתוני ים...</p>
      ) : error ? (
        <p>שגיאה בטעינת נתונים: {error.message || "לא ניתן לטעון נתוני ים"}</p>
      ) : sea ? (
        <>
          <p>גובה הגלים: {sea.height} מטר</p>
          <p>טמפרטורת פני הים: {sea.seaSurfaceTemp}°C</p>
          <p>תקופת הגלים (משך הזמן בין גל לגל): {sea.wavePeriod} שניות</p>
        </>
      ) : (
        <p>לא ניתן לטעון נתוני ים עבור השעה הנוכחית</p>
      )}

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
