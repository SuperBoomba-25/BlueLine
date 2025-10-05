import { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/register", form);
      alert("נרשמת בהצלחה!");
      console.log(res.data);
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
          placeholder="סיסמה"
          onChange={handleChange}
          required
        />
        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
}

export default RegisterPage;
