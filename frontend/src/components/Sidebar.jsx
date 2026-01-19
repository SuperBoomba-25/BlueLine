// frontend/src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  // State לניהול הפתיחה והסגירה במובייל
  const [isOpen, setIsOpen] = useState(false);

  // פונקציה לסגירת התפריט (מופעלת כשלוחצים על קישור)
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* כפתור המבורגר למובייל (מופיע רק במסכים קטנים) */}
      <button
        className="hamburger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="פתח תפריט"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* התפריט עצמו - מוסיף class 'open' אם ה-State הוא true */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>BlueLine</h2>

        <nav>
          {/* שימוש ב-NavLink מאפשר לדעת איזה עמוד פעיל ולתת לו עיצוב שונה */}
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            דף הבית
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            קורסים
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            בלוג
          </NavLink>

          <NavLink
            to="/trips"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            טיולים
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            פרופיל
          </NavLink>

          {/* אזור התחברות/הרשמה */}
          <div className="auth-links">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              התחברות
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              הרשמה
            </NavLink>
          </div>
        </nav>
      </div>

      {/* מסך כהה ברקע כשפותחים תפריט במובייל */}
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
}

export default Sidebar;
