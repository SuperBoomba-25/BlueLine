// frontend/src/components/Header.jsx (או היכן שזה ממוקם)

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
    <aside /* style={styles.sidebar} */>
      <h2 /* style={styles.logo} */>🌊 BlueLine</h2>
      <nav /* style={styles.nav} */>
        <Link to="/" /* style={styles.link} */>🏠 דף הבית</Link>

        {/* ✅ קישורים קבועים לכל משתמש: */}
        <Link to="/courses" /* style={styles.link} */>📘 קורסים</Link>
        <Link to="/blog" /* style={styles.loglink} */>📰 בלוג</Link>
        <Link to="/trips" /* style={styles.link} */>✈️ טיולים</Link>

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
