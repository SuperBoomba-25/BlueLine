import { Link, useNavigate } from "react-router-dom";
// אין צורך לייבא את useState

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    // שים לב: תצטרך להוסיף classNames במקום styles, למשל: className="sidebar"
    <aside /* style={styles.sidebar} */>
      <h2 /* style={styles.logo} */>🌊 BlueLine</h2>
      <nav /* style={styles.nav} */>
        <Link to="/" /* style={styles.link} */>🏠 דף הבית</Link>
        {user ? (
          <>
            <Link to="/profile" /* style={styles.link} */>
              🙍‍♂ הפרופיל שלי
            </Link>
            <button onClick={logoutHandler} /* style={styles.button} */>
              🔓 התנתקות
            </button>
            <p /* style={styles.welcome} */>שלום {user.name}</p>
          </>
        ) : (
          <>
            <Link to="/login" /* style={styles.link} */>🔐 התחברות</Link>
            <Link to="/register" /* style={styles.link} */>📝 הרשמה</Link>
          </>
        )}
      </nav>
    </aside>
  );
}

// **הוסר אובייקט styles**

export default Header;
