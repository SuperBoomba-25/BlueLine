import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 🗑️ וודא שאין בדיקה על captchaValue

    try {
      const res = await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role, // 🗑️ וודא ש-captchaValue לא נשלח
      }); // ... לוגיקת הצלחה ...
    } catch (err) {
      // ... טיפול בשגיאות ...
    }
  };

  return (
    // 🗑️ וודא שרכיב ReCAPTCHA לא קיים ב-JSX
    <div className="container">
            <h2>הרשמה</h2>      {/* ... הטופס ... */}   {" "}
    </div>
  );
}

export default RegisterPage;
