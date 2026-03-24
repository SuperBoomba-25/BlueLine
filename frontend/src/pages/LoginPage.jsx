import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
// ✅ ייבוא הפונקציה שמקפיצה את ההודעה המעוצבת
import toast from "react-hot-toast";

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
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      console.log("תשובת שרת בהתחברות:", res.data);

      // 1. שמירת הטוקן
      localStorage.setItem("token", res.data.token);

      // 2. חילוץ פרטי המשתמש
      const userData = res.data.user ? res.data.user : res.data;

      // שמירה בלוקל סטורג'
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ הופעת הודעה מעוצבת ומודרנית במקום alert!
      toast.success("התחברת בהצלחה! 👋", {
        duration: 1500, // ההודעה תוצג למשך שניה וחצי
      });

      // 3. הפניה לפי תפקיד ורענון (לאחר השהייה כדי שהמשתמש יראה את ההודעה)
      setTimeout(() => {
        if (userData.role === "admin" || userData.role === "employee") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        // רענון כדי שהאתר יתעדכן
        window.dispatchEvent(new Event("storage"));
        window.location.reload();
      }, 1500); // 1500 מילישניות = שנייה וחצי
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "שגיאה בהתחברות, נסה שוב.");
      // ✅ אפשר גם לשים הודעת שגיאה מעוצבת פה אם תרצה!
      // toast.error("שגיאה בהתחברות!");
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
