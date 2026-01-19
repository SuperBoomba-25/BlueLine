import React from "react";
import { Navigate } from "react-router-dom";

// מקבל פרופ בשם adminOnly. ברירת המחדל היא false (כלומר, הגנה רגילה רק להתחברות)
const ProtectedRoute = ({ children, adminOnly = false }) => {
  // שליפת המשתמש מה-LocalStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // 1. בדיקה בסיסית: האם המשתמש מחובר בכלל?
  if (!user || !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  // 2. בדיקת הרשאות: אם הדף דורש אדמין, האם המשתמש הוא מנהל או עובד?
  if (adminOnly) {
    // אם המשתמש הוא לא אדמין ולא עובד -> זרוק אותו לדף הבית
    if (user.role !== "admin" && user.role !== "employee") {
      alert("אין לך הרשאה לגשת לדף זה"); // אופציונלי
      return <Navigate to="/" replace />;
    }
  }

  // 3. הכל תקין - הצג את הדף
  return children;
};

export default ProtectedRoute;
