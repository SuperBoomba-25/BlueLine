import React, { useEffect, useState } from "react";
import api from "../api"; // axios עם baseURL = '/api'
import "./CoursesPage.css";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
      const res = await api.post(/courses/${courseId}/enroll);
      setMessage(res.data.message);

      // עדכון מקומי של משתתפים
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId
            ? { ...c, participants: [...c.participants, "x"] }
            : c
        )
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "שגיאה בהרשמה");
    }
  };

  if (loading) return <p className="loading-text">טוען קורסים...</p>;

  return (
    <div className="courses-container">
      <h1>🎓 קורסי גלישה</h1>
      <p className="intro">
        כאן תוכלו למצוא קורסי גלישה לכל הרמות – ממתחילים שעולים על הגלשן
        בפעם הראשונה, ועד גולשים מתקדמים שרוצים לשפר טכניקה, קריאת ים וביצועים
        על הגל.
      </p>

      {message && <p className="info-box">{message}</p>}

      <div className="courses-grid">
        {courses.map((course) => {
          const spotsLeft = course.maxParticipants - course.participants.length;

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
                  🏄‍♂ <strong>רמה:</strong> {course.level}
                </p>

                <p className="course-price">
                  💸 <strong>מחיר:</strong> {course.price} ₪
                </p>

                <p className="course-duration">
                  ⏱ <strong>משך הקורס:</strong> {course.duration}
                </p>

                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}

                {/* כותרת "מה כלול" לפני התוכן */}
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
                  👤 <strong>גילאים מתאימים:</strong> {course.minAge}–
                  {course.maxAge}
                </p>

                <p className="course-spots">
                  🧍‍♂ מקומות פנויים:{" "}
                  <strong
                    style={{ color: spotsLeft === 0 ? "red" : "green" }}
                  >
                    {spotsLeft === 0 ? "מלא" : spotsLeft}
                  </strong>
                </p>

                <button
                  className="enroll-btn"
                  disabled={spotsLeft === 0}
                  onClick={() => enrollCourse(course._id)}
                >
                  {spotsLeft === 0 ? "הקורס מלא" : "להרשמה לקורס"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CoursesPage;