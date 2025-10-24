import { Link, useNavigate } from "react-router-dom";
// ייבוא נכון של קובץ ה-CSS, בהנחה שהוא באותה תיקייה
import "./Sidebar.css";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    // הוספת className="sidebar" לתיקון הפריסה והחלת העיצוב
    <aside className="sidebar">
      <h2>BlueLine</h2>
      <nav>
        <Link to="/">דף הבית</Link>
        <Link to="/courses">קורסים</Link>
        <Link to="/blog">בלוג</Link>
        <Link to="/trips">טיולים</Link>

        {user ? (
          <>
            <Link to="/profile">הפרופיל שלי</Link>
            <button onClick={logoutHandler}>התנתקות</button>
            <p>שלום {user.name}</p>
          </>
        ) : (
          <>
            <Link to="/login">התחברות</Link>
            <Link to="/register">הרשמה</Link>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Header;
