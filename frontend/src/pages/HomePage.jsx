import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [time, setTime] = useState(new Date());
  const [waveData, setWaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const latitude = 32.08; // תל אביב
  const longitude = 34.78;

  // שעון
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // הבאת נתוני ים
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${yyyy}-${mm}-${dd}`;

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
              timezone: "Asia/Jerusalem",
            },
          }
        );

        setWaveData(res.data?.hourly || null);
      } catch (err) {
        console.error("שגיאה בטעינת תחזית הים:", err);
        setError(
          err?.response?.data?.reason || "לא הצלחנו לטעון נתוני ים כרגע."
        );
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

  const greetingMeta = useMemo(() => {
    if (hour >= 5 && hour < 12) {
      return { greeting: "בוקר טוב", emoji: "☀️", theme: "morning" };
    }
    if (hour >= 12 && hour < 18) {
      return { greeting: "צהריים טובים", emoji: "🌤️", theme: "noon" };
    }
    return { greeting: "ערב טוב", emoji: "🌙", theme: "night" };
  }, [hour]);

  const seaNow = useMemo(() => {
    if (!waveData?.time?.length) return null;

    // מציאת האינדקס הקרוב לשעה הנוכחית
    const currentHourISO = time.toISOString().slice(0, 13); // YYYY-MM-DDTHH
    let idx = waveData.time.findIndex((t) => t.startsWith(currentHourISO));
    if (idx === -1) idx = 0;

    return {
      height: waveData.wave_height?.[idx],
      seaSurfaceTemp: waveData.sea_surface_temperature?.[idx],
      wavePeriod: waveData.wave_period?.[idx],
      isoTime: waveData.time?.[idx],
    };
  }, [waveData, time]);

  // “שעות מומלצות” (דוגמה פשוטה): מחפש 3 שעות עם גל סביר לגלישה (0.6–1.6)
  const recommendedTimes = useMemo(() => {
    if (!waveData?.time?.length) return [];

    const items = waveData.time.map((t, idx) => ({
      t,
      height: waveData.wave_height?.[idx],
      temp: waveData.sea_surface_temperature?.[idx],
      period: waveData.wave_period?.[idx],
    }));

    const filtered = items
      .filter((x) => typeof x.height === "number")
      .filter((x) => x.height >= 0.6 && x.height <= 1.6)
      .sort((a, b) => (b.period || 0) - (a.period || 0)) // יותר period => לפעמים “גל יותר נקי”
      .slice(0, 3);

    // אם אין—נחזיר 3 ראשונות שיש להן נתון
    if (filtered.length > 0) return filtered;

    return items.filter((x) => typeof x.height === "number").slice(0, 3);
  }, [waveData]);

  const seaLabel = (h) => {
    if (typeof h !== "number") return "לא ידוע";
    if (h < 0.4) return "שקט";
    if (h < 0.8) return "קליל";
    if (h < 1.4) return "טוב";
    return "חזק";
  };

  return (
    <div className={`home-page ${greetingMeta.theme}`}>
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-text">
            <div className="home-badge">BlueLine • Surf Community</div>

            <h1 className="home-title">
              {greetingMeta.greeting} {greetingMeta.emoji}
            </h1>

            {user ? (
              <p className="home-subtitle">
                {user.name}, שמחים לראות אותך שוב. בוא נבדוק מה הים אומר היום 🏄‍♂️
              </p>
            ) : (
              <p className="home-subtitle">
                ברוך הבא! התחבר/הירשם כדי להירשם לקורסים, טיולים ולהשתתף
                באשכולות דיון.
              </p>
            )}

            <div className="home-meta">
              <span>📅 {date}</span>
              <span>⏰ {currentTime}</span>
              <span>📍 תל אביב</span>
            </div>

            <div className="home-cta">
              <Link className="btn primary" to="/courses">
                קורסים
              </Link>
              <Link className="btn" to="/trips">
                טיולי גלישה
              </Link>
              <Link className="btn" to="/blog">
                בלוג
              </Link>

              {!user && (
                <div className="home-auth">
                  <Link className="btn ghost" to="/login">
                    התחברות
                  </Link>
                  <Link className="btn ghost" to="/register">
                    הרשמה
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* SEA SNAPSHOT */}
          <div className="home-sea-card">
            <div className="card-header">
              <h3>🌊 תנאי הים עכשיו</h3>
              <span className="card-chip">
                {seaNow?.height != null ? seaLabel(seaNow.height) : "טוען..."}
              </span>
            </div>

            {loading ? (
              <div className="skeleton">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            ) : error ? (
              <p className="error-text">שגיאה: {error}</p>
            ) : seaNow ? (
              <div className="sea-stats">
                <div className="sea-stat">
                  <span className="k">גובה גלים</span>
                  <span className="v">{seaNow.height} מ׳</span>
                </div>
                <div className="sea-stat">
                  <span className="k">טמפ׳ ים</span>
                  <span className="v">{seaNow.seaSurfaceTemp}°C</span>
                </div>
                <div className="sea-stat">
                  <span className="k">תקופה</span>
                  <span className="v">{seaNow.wavePeriod} שנ׳</span>
                </div>

                <div className="sea-note">
                  טיפ: “תקופה” גבוהה יותר יכולה להעיד על גל “מסודר” יותר.
                </div>
              </div>
            ) : (
              <p className="muted">לא הצלחנו לחשב נתון לשעה הנוכחית.</p>
            )}

            <div className="divider" />

            <div className="recommended">
              <h4>⏱ שעות מומלצות היום</h4>
              {loading ? (
                <p className="muted">טוען...</p>
              ) : recommendedTimes.length === 0 ? (
                <p className="muted">אין המלצות זמינות כרגע.</p>
              ) : (
                <ul className="recommended-list">
                  {recommendedTimes.map((x, i) => {
                    const hhmm = new Date(x.t).toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <li key={i} className="recommended-item">
                        <span className="time">{hhmm}</span>
                        <span className="mini">
                          🌊 {x.height}מ׳ • ⏳ {x.period ?? "-"}ש׳ • 🌡{" "}
                          {x.temp ?? "-"}°
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="home-section">
        <h2 className="section-title">מה אפשר לעשות באתר?</h2>

        <div className="feature-grid">
          <Link to="/courses" className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>קורסים לגלישה</h3>
            <p>מצאו קורס שמתאים לרמה שלכם, גילאים, משך ומחיר.</p>
            <span className="feature-link">לצפייה בקורסים →</span>
          </Link>

          <Link to="/trips" className="feature-card">
            <div className="feature-icon">🌴</div>
            <h3>טיולי גלישה</h3>
            <p>טיולים מאורגנים עם קבוצות, מדריכים והכל מסודר מראש.</p>
            <span className="feature-link">לצפייה בטיולים →</span>
          </Link>

          <Link to="/blog" className="feature-card">
            <div className="feature-icon">📰</div>
            <h3>בלוג + דיונים</h3>
            <p>מדריכים, כתבות, וחיבור לקהילה עם אשכולות דיון.</p>
            <span className="feature-link">לבלוג →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
