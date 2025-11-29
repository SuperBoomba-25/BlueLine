import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../api";

function LoginPage() {
  const siteKey = "6LeKzBssAAAAABX5JuU_CdiPuFZtGbBsRa8uDa3o";

  const [form, setForm] = useState({ email: "", password: "" });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaValue) {
      return setError("אנא אשר שאינך רובוט לפני ההתחברות");
    }

    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
        captchaValue: captchaValue, // הטוקן נשלח ל-Backend
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      alert("התחברת בהצלחה!");

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
        {/* רכיב ReCAPTCHA משתמש ב-siteKey החדש */}
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={(value) => setCaptchaValue(value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">התחברות</button>
      </form>
    </div>
  );
}

export default LoginPage;
