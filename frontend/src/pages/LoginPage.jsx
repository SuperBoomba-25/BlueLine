import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      // --- התיקון כאן ---
      localStorage.setItem("token", res.data.token);

      // יצירת אובייקט משתמש מסודר שמתאים למה שה-Header מצפה לקבל
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        role: res.data.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      alert("התחברת בהצלחה!");

      // בדיקת ה-role ישירות מהתגובה
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      // ------------------
    } catch (err) {
      alert(err.response?.data?.message || "שגיאה בהתחברות");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container">
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="אימייל"
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          name="password"
          placeholder="סיסמה"
          type="password"
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">התחברות</button>
      </form>
    </div>
  );
}

export default LoginPage;
