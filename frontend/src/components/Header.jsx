import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // גורם ל-Component להתרנדר מחדש במעבר דפים
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]); // בכל פעם שהדף משתנה, הוא יבדוק אם המשתמש מחובר

  const logoutHandler = () => {
    localStorage.clear(); // מנקה הכל
    setUser(null);
    navigate("/login");
  };

  return (
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
            <p className="welcome-msg">שלום {user.name}</p>
            <button className="logout-btn" onClick={logoutHandler}>
              התנתקות
            </button>
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
