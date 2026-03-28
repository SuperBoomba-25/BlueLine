import React, { useState } from "react";

function SurfCalculator() {
  const [weight, setWeight] = useState("");
  const [level, setLevel] = useState("beginner");
  const [result, setResult] = useState(null);

  const calculateVolume = (e) => {
    e.preventDefault();

    if (!weight || weight <= 0 || weight > 150) {
      alert("אנא הזן משקל תקין");
      return;
    }

    // נוסחת חישוב נפח (Volume) לפי רמה
    let multiplier = 1.1;
    let boardType = "";

    if (level === "beginner") {
      multiplier = 1.05; // מתחילים צריכים נפח ששווה בערך למשקל שלהם + קצת
      boardType =
        "גלשן סופט (Softboard) או לונגבורד - ייתן לך יציבות מקסימלית ותפיסת גלים קלה.";
    } else if (level === "intermediate") {
      multiplier = 0.75; // בינוניים יורדים בנפח כדי להתחיל לתמרן
      boardType =
        "פאן-בורד (Funboard) או פיש - שילוב מנצח של חתירה קלה ויכולת תמרון.";
    } else if (level === "advanced") {
      multiplier = 0.4; // מתקדמים גולשים על המינימום האפשרי
      boardType =
        "שורט-בורד (Shortboard) - לביצועים מהירים, חיתוכים וגלישה אגרסיבית.";
    }

    const recommendedVolume = Math.round(weight * multiplier);

    // חישוב טווח (ליטר למעלה וליטר למטה)
    const minVolume = recommendedVolume - 2;
    const maxVolume = recommendedVolume + 2;

    setResult({
      volumeText: `${minVolume}L - ${maxVolume}L`,
      boardType: boardType,
    });
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        direction: "rtl",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#0077cc", marginBottom: "10px" }}>
        🏄‍♂️ מחשבון מידות גלשן
      </h2>
      <p style={{ color: "#555", marginBottom: "25px" }}>
        גלה איזה נפח (Volume) וסוג גלשן הכי מתאימים לך.
      </p>

      <form
        onSubmit={calculateVolume}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div style={{ textAlign: "right" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            משקל (בק"ג):
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="לדוגמה: 75"
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            רמת גלישה:
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          >
            <option value="beginner">🟢 מתחיל (צעדים ראשונים / קצף)</option>
            <option value="intermediate">
              🟡 בינוני (תופס פינה / יורד גל פתוח)
            </option>
            <option value="advanced">🔴 מתקדם (ביצועים / צינורות)</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#0077cc",
            color: "white",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
            transition: "background 0.3s",
          }}
        >
          חשב לי מידה 🌊
        </button>
      </form>

      {/* אזור הצגת התוצאה */}
      {result && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#e3f2fd",
            borderRadius: "10px",
            borderRight: "5px solid #0077cc",
            animation: "fadeIn 0.5s",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>התוצאה שלך:</h3>
          <p style={{ fontSize: "1.2rem", margin: "0 0 10px 0" }}>
            נפח מומלץ:{" "}
            <strong style={{ color: "#0077cc", fontSize: "1.5rem" }}>
              {result.volumeText}
            </strong>
          </p>
          <p style={{ fontSize: "1rem", color: "#444", margin: 0 }}>
            <strong>סוג הגלשן:</strong> {result.boardType}
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default SurfCalculator;
