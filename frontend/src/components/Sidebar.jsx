// frontend/src/components/Sidebar.jsx (או היכן שזה ממוקם)

import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🔷 BlueLine</h2>
      <nav>
        <Link to="/">🏠 דף הבית</Link>

        {/* ✅ הוספת הקישורים החדשים: */}
        <Link to="/courses">📘 קורסים</Link>
        <Link to="/blog">📰 בלוג</Link>
        <Link to="/trips">✈️ טיולים</Link>

        <Link to="/profile">👤 פרופיל</Link>
        <Link to="/login">🔐 התחברות</Link>
        <Link to="/register">📝 הרשמה</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
