import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בשליחת המייל, נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>🔒 שכחתי סיסמה</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            background: loading ? "#ccc" : "#0077b6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {loading ? "שולח..." : "שלח לי קישור לאיפוס"}
        </button>
      </form>

      {message && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "15px" }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{ color: "red", fontWeight: "bold", marginTop: "15px" }}>
          {error}
        </p>
      )}

      <p style={{ marginTop: "20px" }}>
        נזכרת בסיסמה? <Link to="/login">חזור להתחברות</Link>
      </p>
    </div>
  );
}

export default ForgotPasswordPage;
