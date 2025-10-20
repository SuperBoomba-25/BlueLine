import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function LoginPage() {
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
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
      const res = await axios.post("/api/login", { ...form, captchaValue });
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("התחברת בהצלחה!");
      navigate("/");
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
        />
        <input
          name="password"
          placeholder="סיסמה"
          type="password"
          onChange={handleChange}
          required
        />

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
