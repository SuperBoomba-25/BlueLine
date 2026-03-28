import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // תופס את הטוקן משורת הכתובת (URL)
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      return setError("הסיסמאות לא תואמות!");
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);

      // מעביר אוטומטית למסך התחברות אחרי 3 שניות
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "הקישור פג תוקף או שגויה. נסה לבקש שוב."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>🔑 איפוס סיסמה</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        הזן את הסיסמה החדשה שלך למטה.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="password"
          placeholder="סיסמה חדשה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="אימות סיסמה חדשה"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            background: loading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {loading ? "מעדכן..." : "שמור סיסמה חדשה"}
        </button>
      </form>

      {message && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "15px" }}>
          {message}
        </p>
      )}
      {error && (
        <div style={{ marginTop: "15px" }}>
          <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
          <Link
            to="/forgot-password"
            style={{ color: "#0077b6", textDecoration: "underline" }}
          >
            בקש קישור חדש כאן
          </Link>
        </div>
      )}
    </div>
  );
}

export default ResetPasswordPage;
