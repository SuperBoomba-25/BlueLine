import { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      return setError("הסיסמה חייבת להכיל לפחות 8 תווים");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      return setError("הסיסמה חייבת לכלול אות גדולה, אות קטנה ומספר אחד");
    }

    if (form.password !== form.confirmPassword) {
      return setError("הסיסמאות אינן תואמות");
    }

    if (!captchaValue) {
      return setError("אנא אשר שאינך רובוט");
    }

    try {
      const res = await axios.post("/api/register", {
        ...form,
        captchaValue,
      });

      // שמירת משתמש + טוקן
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      alert("נרשמת בהצלחה!");
    } catch (err) {
      alert(err.response?.data?.message || "שגיאה בהרשמה");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>הרשמה</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="שם מלא"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="אימייל"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="סיסמה (לפחות 8 תווים)"
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="אימות סיסמה"
          onChange={handleChange}
          required
        />

        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={(value) => setCaptchaValue(value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
}

export default RegisterPage;
