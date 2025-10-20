import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🔷 BlueLine</h2>
      <nav>
        <Link to="/">🏠 דף הבית</Link>
        <Link to="/profile">👤 פרופיל</Link>
        <Link to="/login">🔐 התחברות</Link>
        <Link to="/register">📝 הרשמה</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
