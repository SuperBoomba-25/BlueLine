import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import TripsPage from "./pages/TripsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import BlogDiscussionPage from "./pages/BlogDiscussionPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />
            {/* ✅ נתיב חדש: עמוד יצירת אשכול - מוגן למשתמשים רשומים בלבד */}
            <Route
              path="/discussion/new"
              element={
                <ProtectedRoute>
                  {/* דף זמני ליצירת אשכול חדש */}
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                    }}
                  >
                    <h1>דף יצירת אשכול חדש</h1>
                    <p>כאן יופיע בהמשך טופס ליצירת נושא דיון חדש.</p>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/blog/discussion/:postId"
              element={<BlogDiscussionPage />}
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
