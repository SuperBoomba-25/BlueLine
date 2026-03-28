import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import TripsPage from "./pages/TripsPage";
import BlogDiscussionPage from "./pages/BlogDiscussionPage";
import CreateThreadPage from "./pages/CreateThreadPage";
import AdminPage from "./pages/AdminPage";

// ✅ ייבוא דפי שחזור סיסמה
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// ייבוא רכיבים
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import SurfCalculator from "./components/SurfCalculator";

// עיצוב
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* התפריט הצדדי הקבוע */}
        <Sidebar />

        {/* אזור התוכן המרכזי */}
        <div className="main-content">
          <Routes>
            {/* נתיבים פתוחים לכולם */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/trips" element={<TripsPage />} />

            {/* ✅ נתיבים חדשים לשחזור סיסמה */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />

            {/* הנתיב למחשבון הגלשנים (פתוח לכולם) */}
            <Route path="/calculator" element={<SurfCalculator />} />

            {/* בלוג ופוסטים */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />
            <Route
              path="/blog/discussion/:postId"
              element={<BlogDiscussionPage />}
            />

            {/* נתיבים מוגנים (דורשים התחברות בלבד) */}
            <Route
              path="/discussion/new"
              element={
                <ProtectedRoute>
                  <CreateThreadPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* נתיב לדף האדמין - מוגן למנהלים ועובדים בלבד! */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
