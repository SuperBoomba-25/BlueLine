import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // הוספתי Link שיהיה נוח
import api from "../api";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // שים לב: וודא שהנתיב בשרת הוא אכן /login או /auth/login או /users/login
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      console.log("תשובת שרת בהתחברות:", res.data); // לוג לדיבאג

      // 1. שמירת הטוקן
      localStorage.setItem("token", res.data.token);

      // 2. חילוץ פרטי המשתמש בצורה חכמה
      // בדיקה: האם המידע נמצא בתוך res.data.user או שטוח ב-res.data?
      const userData = res.data.user ? res.data.user : res.data;

      // שמירה בלוקל סטורג' כדי שה-Sidebar וה-ProtectedRoute יכירו אותו
      localStorage.setItem("user", JSON.stringify(userData));

      // 3. הפניה לפי תפקיד
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "employee") {
        // אם תרצה דף מיוחד לעובדים בעתיד
        navigate("/admin");
      } else {
        navigate("/");
      }

      // רענון קטן כדי שה-Sidebar יתעדכן מיד (אופציונלי, תלוי איך ה-Sidebar בנוי)
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "שגיאה בהתחברות, נסה שוב.");
    }
  };

  return (
    <div
      className="auth-container"
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>🔑 התחברות למערכת</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          name="email"
          type="email"
          placeholder="אימייל"
          onChange={handleChange}
          required
          autoComplete="username"
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          name="password"
          placeholder="סיסמה"
          type="password"
          onChange={handleChange}
          required
          autoComplete="current-password"
          style={{ padding: "10px", fontSize: "16px" }}
        />

        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: "10px",
            cursor: "pointer",
            background: "#0077b6",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          התחבר
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        אין לך משתמש? <Link to="/register">הירשם כאן</Link>
      </p>
    </div>
  );
}

export default LoginPage;
