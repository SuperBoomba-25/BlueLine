import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // 🟢 שחזור: ייבוא
import api from "../api";

function LoginPage() {
  const siteKey = "6LdXuRssAAAAAE5XgZPx2FoW2Y9tKi_i6agWFSpl";
  const [form, setForm] = useState({ email: "", password: "" });
  const [captchaValue, setCaptchaValue] = useState(null); // 🟢 שחזור: מצב captchaValue
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 🟢 שחזור: בדיקת captchaValue לפני השליחה לשרת
    if (!captchaValue) {
      return setError("אנא אשר שאינך רובוט לפני ההתחברות");
    }

    try {
      // 🟢 שחזור: שליחת captchaValue לשרת
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
        captchaValue: captchaValue, // נשלח חזרה
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
            <h2>התחברות</h2>     {" "}
      <form onSubmit={handleSubmit}>
               {" "}
        <input
          name="email"
          placeholder="אימייל"
          onChange={handleChange}
          required
        />
               {" "}
        <input
          name="password"
          placeholder="סיסמה"
          type="password"
          onChange={handleChange}
          required
        />
                {/* 🟢 שחזור: קומפוננטת ReCAPTCHA */}       {" "}
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={(value) => setCaptchaValue(value)}
        />
                {error && <p style={{ color: "red" }}>{error}</p>}       {" "}
        <button type="submit">התחברות</button>     {" "}
      </form>
         {" "}
    </div>
  );
}

export default LoginPage;
