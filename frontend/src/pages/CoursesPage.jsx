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
      const res = await api.post(`/courses/${courseId}/enroll`);
      setMessage(res.data.message);

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

  if (loading) return <p>טוען קורסים...</p>;

  return (
    <div className="courses-container">
      <h2>🎓 קורסים לגלישה</h2>
      {message && <p className="info-box">{message}</p>}

      <div className="courses-grid">
        {courses.map((course) => {
          const spotsLeft = course.maxParticipants - course.participants.length;

          return (
            <div key={course._id} className="course-card">
              <img
                src={course.image}
                alt={course.name}
                className="course-image"
              />

              <h3>{course.name}</h3>
              <p>
                <strong>רמה:</strong> {course.level}
              </p>

              <p>
                <strong>מחיר:</strong> {course.price} ₪
              </p>

              <p>
                <strong>משך:</strong> {course.duration}
              </p>

              <p>{course.description}</p>

              <p>
                🎒 <strong>מה כלול:</strong>
              </p>
              <ul>
                {course.includes.map((item, idx) => (
                  <li key={idx}>✔ {item}</li>
                ))}
              </ul>

              <p>
                👤 <strong>גילאים:</strong> {course.minAge}–{course.maxAge}
              </p>

              <p>
                🧍‍♂️ מקומות פנויים:{" "}
                <strong style={{ color: spotsLeft === 0 ? "red" : "green" }}>
                  {spotsLeft === 0 ? "מלא" : spotsLeft}
                </strong>
              </p>

              <button
                className="enroll-btn"
                disabled={spotsLeft === 0}
                onClick={() => enrollCourse(course._id)}
              >
                {spotsLeft === 0 ? "מלא" : "להרשמה"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CoursesPage;
