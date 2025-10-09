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
  );
}

const styles = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: "linear-gradient(to bottom, #0077b6, #00b4d8)",
    padding: "30px 20px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "fixed",
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  logo: {
    marginBottom: "40px",
    color: "white",
    fontWeight: "900",
    fontSize: "1.8rem",
    textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    padding: "8px 12px",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease",
  },
  welcome: {
    marginTop: "20px",
    color: "#eee",
    fontSize: "1rem",
    textAlign: "center",
  },
};

export default Header;
