import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // מאזין לשינויי דפים
  const [user, setUser] = useState(null);

  // בכל פעם שהמיקום (URL) משתנה, נבדוק מחדש אם יש משתמש ב-Storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const logoutHandler = () => {
    localStorage.clear(); // מנקה את כל הנתונים (token, user, וכו')
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
            <div className="user-info">
              <span
                style={{ color: "white", display: "block", margin: "10px 0" }}
              >
                שלום {user.name} 👋
              </span>
              <button
                onClick={logoutHandler}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px",
                }}
              >
                התנתקות
              </button>
            </div>
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
