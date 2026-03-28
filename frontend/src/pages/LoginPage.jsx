import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  // הסטייט שמנהל את הופעת ההודעה הירוקה
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // 1. שמירת הטוקן ופרטי המשתמש
      localStorage.setItem("token", res.data.token);
      const userData = res.data.user ? res.data.user : res.data;
      localStorage.setItem("user", JSON.stringify(userData));

      // 2. מדליק את ההודעה הירוקה והמודרנית
      setShowToast(true);

      // משדר לשאר האתר שהמשתמש התחבר (מעדכן את התפריט בלי רענון דפדפן!)
      window.dispatchEvent(new Event("storage"));

      // 3. מחכה שנייה אחת (כדי שהמשתמש יקרא את ההודעה) ואז מעביר עמוד
      setTimeout(() => {
        if (userData.role === "admin" || userData.role === "employee") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1200);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "שגיאה בהתחברות, נסה שוב.");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* 🟢 ההודעה המעוצבת שתקפוץ ותעבוד בצורה חלקה 🟢 */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
            color: "white",
            padding: "15px 30px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            fontSize: "1.1rem",
            fontWeight: "bold",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeInDown 0.3s ease-out forwards",
          }}
        >
          <span>✅</span> התחברת בהצלחה!
        </div>
      )}

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
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          התחבר
        </button>
      </form>

      {/* ✅ הוספנו את הקישור לשכחתי סיסמה ✅ */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <p style={{ margin: 0 }}>
          <Link
            to="/forgot-password"
            style={{
              color: "#0077b6",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            שכחת סיסמה?
          </Link>
        </p>
        <p style={{ margin: 0 }}>
          אין לך משתמש? <Link to="/register">הירשם כאן</Link>
        </p>
      </div>

      {/* תוספת אנימציה קטנה להודעה הקופצת שייראה ממש מקצועי */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
