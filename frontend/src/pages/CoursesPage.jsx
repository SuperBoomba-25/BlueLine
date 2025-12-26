import React, { useEffect, useState } from "react";
import api from "../api"; // axios עם baseURL = '/api'
import "./CoursesPage.css";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // בדיקת התחברות וזיהוי משתמש
  const isLoggedIn = !!localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("שגיאה בטעינת הקורסים");
        setLoading(false);
      });
  }, []);

  const enrollCourse = async (courseId) => {
    try {
      const res = await api.post(`/courses/${courseId}/enroll`);
      setMessage(res.data.message);

      // עדכון נכון: מחליפים את הקורס הישן באובייקט המעודכן שהגיע מהשרת
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? res.data.course : c))
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "שגיאה בהרשמה");
    }
  };

  if (loading) return <p className="loading-text">טוען קורסים...</p>;

  return (
    <div className="courses-container">
      <h1>🎓 קורסים גלישה</h1>
      <p className="intro">
        כאן תוכלו למצוא קורסי גלישה לכל הרמות – ממתחילים שעולים על הגלשן בפעם
        הראשונה, ועד גולשים מתקדמים שרוצים לשפר טכניקה, קריאת ים וביצועים על
        הגל.
      </p>

      {message && <p className="info-box">{message}</p>}

      <div className="courses-grid">
        {courses.map((course) => {
          const spotsLeft = course.maxParticipants - course.participants.length;
          // בדיקה האם המשתמש הנוכחי כבר נמצא ברשימת המשתתפים של הקורס
          const isAlreadyEnrolled = course.participants.some(
            (p) => p.userId === userId || p.userId?._id === userId
          );

          return (
            <div key={course._id} className="course-card">
              {course.image && (
                <img
                  src={course.image}
                  alt={course.name}
                  className="course-image"
                />
              )}

              <div className="course-info">
                <h3>{course.name}</h3>

                <p className="course-level">
                  | 🏄‍♂️ <strong>רמה:</strong> {course.level}
                </p>

                <p className="course-price">
                  | 💸 <strong>מחיר:</strong> {course.price} ₪
                </p>

                <p className="course-duration">
                  | ⏱ <strong>משך הקורס:</strong> {course.duration}
                </p>

                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}

                {course.includes && course.includes.length > 0 && (
                  <>
                    <h4 className="includes-title">🎒 מה כלול בקורס?</h4>
                    <ul className="includes-list">
                      {course.includes.map((item, idx) => (
                        <li key={idx}>✔ {item}</li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="course-ages">
                  | 👤 <strong>גילאים מתאימים:</strong> {course.minAge}–
                  {course.maxAge}
                </p>

                <p className="course-spots">
                  | 🧍‍♂️ מקומות פנויים:{" "}
                  <strong style={{ color: spotsLeft === 0 ? "red" : "green" }}>
                    {spotsLeft === 0 ? "מלא" : spotsLeft}
                  </strong>
                </p>

                <div className="action-area">
                  {isAlreadyEnrolled ? (
                    <button disabled className="enroll-btn enrolled">
                      אתה כבר רשום לקורס זה
                    </button>
                  ) : spotsLeft === 0 ? (
                    <button disabled className="enroll-btn full">
                      הקורס מלא
                    </button>
                  ) : !isLoggedIn ? (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      יש להתחבר כדי להירשם
                    </p>
                  ) : (
                    <button
                      className="enroll-btn"
                      onClick={() => enrollCourse(course._id)}
                    >
                      להרשמה לקורס
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CoursesPage;
