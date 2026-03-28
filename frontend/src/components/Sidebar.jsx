import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // סטייט שמנהל את הופעת החלון המעוצב של ההתנתקות
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const closeMenu = () => setIsOpen(false);

  // פונקציה שפותחת את החלון המעוצב
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // פונקציה שמופעלת רק אם המשתמש לחץ "כן" בחלון המעוצב
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowLogoutModal(false); // סגירת המודל
    closeMenu();
    navigate("/login");
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

          {/* ✅ הכפתור החדש של מחשבון המידות (פתוח לכולם) */}
          <NavLink
            to="/calculator"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            📐 מחשבון מידות
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              👤 פרופיל אישי
            </NavLink>
          )}

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
              <button className="logout-btn-menu" onClick={handleLogoutClick}>
                🚪 התנתק
              </button>
            ) : (
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

      {/* 🔴 החלון הקופץ המעוצב להתנתקות 🔴 */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              maxWidth: "350px",
              width: "90%",
              animation: "popIn 0.3s ease-out forwards",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#333" }}>התנתקות</h3>
            <p
              style={{ color: "#666", marginBottom: "25px", fontSize: "16px" }}
            >
              האם אתה בטוח שברצונך להתנתק מהמערכת?
            </p>
            <div
              style={{ display: "flex", gap: "15px", justifyContent: "center" }}
            >
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flex: 1,
                }}
              >
                ביטול
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flex: 1,
                }}
              >
                כן, התנתק
              </button>
            </div>
          </div>

          <style>{`
            @keyframes popIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default Sidebar;
