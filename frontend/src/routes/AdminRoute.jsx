import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // צריך לשמור role ב-localStorage אחרי login

  // אם אין token או לא admin – נשלח לדף הבית
  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // מאפשר את כל Routes הפנימיים
};

export default AdminRoute;
