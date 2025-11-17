import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user)
    return (
      <div className="container">
        <p>אין משתמש מחובר</p>
      </div>
    );

  return (
    <div className="container">
      <h2>הפרופיל שלי</h2>
      <p>
        <strong>שם:</strong> {user.name}
      </p>
      <p>
        <strong>אימייל:</strong> {user.email}
      </p>
      <p>
        <strong>תאריך התחברות:</strong> {new Date().toLocaleString()}
      </p>
      <p>
        <strong>תפקיד:</strong> {user.role}
      </p>

      <button onClick={handleLogout}>התנתקות</button>
    </div>
  );
}

export default ProfilePage;
