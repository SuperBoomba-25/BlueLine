import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("אנא מלא את כל השדות");
      return;
    }

    if (form.password.length < 8) {
      setError("הסיסמה חייבת להיות לפחות 8 תווים");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    try {
      setLoading(true);

      // ✅ התיקון: הוספנו /auth להתחלה
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      alert("נרשמת בהצלחה! עכשיו תוכל להתחבר.");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message || "שגיאה בהרשמה. בדוק את הפרטים ונסה שוב.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>הרשמה</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: "12px" }}>
          <label>שם מלא</label>
          <input
            type="text"
            name="name"
            placeholder="שם מלא"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "12px" }}>
          <label>אימייל</label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "12px" }}>
          <label>סיסמה (לפחות 8 תווים)</label>
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group" style={{ marginBottom: "12px" }}>
          <label>אימות סיסמה</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="אימות סיסמה"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
            autoComplete="new-password"
          />
        </div>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "נרשם..." : "הרשמה"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
