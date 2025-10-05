import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Trying to login with:", form);
    try {
      const res = await axios.post("/api/login", form);
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
        <button type="submit">התחברות</button>
      </form>
    </div>
  );
}

export default LoginPage;
