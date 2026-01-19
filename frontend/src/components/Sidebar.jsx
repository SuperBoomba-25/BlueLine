import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // בדיקה אם מחובר
  const navigate = useNavigate();
  const location = useLocation(); // כדי לרענן בדיקה כשעוברים דף

  // פונקציה לבדוק אם המשתמש מחובר
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // הופך ל-true אם יש טוקן
  }, [location]); // רץ כל פעם שעוברים דף

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    if (window.confirm("האם אתה בטוח שברצונך להתנתק?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
      closeMenu();
    }
  };

  return (
    <>
      <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>BlueLine 🌊</h2>

        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            🏠 דף הבית
          </NavLink>

          <NavLink
            to="/trips"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            🏄‍♂️ טיולים
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            🎓 קורסים
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            💬 פורום
          </NavLink>

          {/* הצגה מותנית: אם מחובר - פרופיל, אם לא - כלום */}
          {isLoggedIn && (
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              👤 פרופיל אישי
            </NavLink>
          )}

          {/* הצגה מותנית: אם מחובר - אדמין (אפשר להוסיף בדיקת מנהל בהמשך) */}
          {isLoggedIn && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              🛠️ ניהול
            </NavLink>
          )}

          <div className="auth-links">
            {isLoggedIn ? (
              // כפתור התנתקות למשתמש מחובר
              <button className="logout-btn-menu" onClick={handleLogout}>
                🚪 התנתק
              </button>
            ) : (
              // כפתורי התחברות לאורח
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeMenu}
                >
                  🔑 התחברות
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeMenu}
                >
                  📝 הרשמה
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>

      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
}

export default Sidebar;
