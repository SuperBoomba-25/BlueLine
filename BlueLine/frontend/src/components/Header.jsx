import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🌊 BlueLine</h2>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>
            🏠 דף הבית
          </Link>
          {user ? (
            <>
              <Link to="/profile" style={styles.link}>
                🙍‍♂ הפרופיל שלי
              </Link>
              <button onClick={logoutHandler} style={styles.button}>
                🔓 התנתקות
              </button>
              <p style={styles.welcome}>שלום {user.name}</p>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                🔐 התחברות
              </Link>
              <Link to="/register" style={styles.link}>
                📝 הרשמה
              </Link>
            </>
          )}
        </nav>
      </aside>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    direction: "rtl",
  },
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "#f1f1f1",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
    position: "fixed",
    right: 0,
    top: 0,
  },
  logo: {
    marginBottom: "30px",
    color: "#0077b6",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    textDecoration: "none",
    color: "#023e8a",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  welcome: {
    marginTop: "10px",
    color: "#555",
    fontSize: "0.9rem",
  },
};

export default Header;
