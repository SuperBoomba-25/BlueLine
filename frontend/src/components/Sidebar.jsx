// frontend/src/components/Sidebar.jsx (או היכן שזה ממוקם)

import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>BlueLine</h2> {/* ✅ הסרת האימוג'י */}
      <nav>
        <Link to="/">דף הבית</Link> {/* ✅ הסרת האימוג'י */}
        <Link to="/courses">קורסים</Link>
        <Link to="/blog">בלוג</Link>
        <Link to="/trips">טיולים</Link>
        <Link to="/profile">פרופיל</Link> {/* ✅ הסרת האימוג'י */}
        <Link to="/login">התחברות</Link> {/* ✅ הסרת האימוג'י */}
        <Link to="/register">הרשמה</Link> {/* ✅ הסרת האימוג'י */}
      </nav>
    </div>
  );
}
export default Sidebar;
