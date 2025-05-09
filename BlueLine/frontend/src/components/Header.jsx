import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>🌊 BlueLine</h2>
      <nav>
        <Link to="/" style={styles.link}>
          בית
        </Link>
        {user ? (
          <>
            <span style={styles.link}>שלום {user.name}</span>
            <button onClick={logoutHandler} style={styles.button}>
              התנתק
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              התחברות
            </Link>
            <Link to="/register" style={styles.link}>
              הרשמה
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    background: "#0077b6",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  link: {
    marginLeft: "15px",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  button: {
    marginLeft: "15px",
    background: "#023e8a",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Header;
