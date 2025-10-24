import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import BlogPage from "./pages/BlogPage";
import TripsPage from "./pages/TripsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
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
            <Route
              path="/blog/discussion/:postId"
              element={<BlogDiscussionPage />}
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
