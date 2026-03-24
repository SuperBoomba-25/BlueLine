import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../api";
import "./AdminPage.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [managementView, setManagementView] = useState("menu");

  const [tripsData, setTripsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);

  const [allTrips, setAllTrips] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  // ✅ משתנה חדש לניהול המשתתפים של פריט שנבחר
  const [selectedItemForParticipants, setSelectedItemForParticipants] =
    useState(null);
  const [participantsType, setParticipantsType] = useState(null); // 'trip' or 'course'

  const [loading, setLoading] = useState(true);

  // מודלים
  const [showTripModal, setShowTripModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // טפסים
  const [newTrip, setNewTrip] = useState({
    destination: "",
    date: "",
    price: "",
    description: "",
    image: "",
    maxParticipants: 20,
  });
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    startDate: "",
    image: "",
    maxParticipants: 30,
  });

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isEmployee = user?.role === "employee";

  useEffect(() => {
    if (isEmployee) {
      setLoading(false);
      return;
    }
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [tripsRes, coursesRes] = await Promise.all([
          api.get("/trips/stats").catch(() => ({ data: [] })),
          api.get("/courses/stats").catch(() => ({ data: [] })),
        ]);
        setTripsData(tripsRes.data);
        setCoursesData(coursesRes.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isEmployee]);

  // --- פונקציות ניהול טיולים ---
  const fetchAllTrips = async () => {
    try {
      const res = await api.get("/trips");
      setAllTrips(res.data);
      setManagementView("trips");
    } catch (err) {
      alert("שגיאה");
    }
  };
  const handleDeleteTrip = async (id) => {
    if (window.confirm("למחוק?")) {
      try {
        await api.delete(`/trips/${id}`);
        setAllTrips(allTrips.filter((t) => t._id !== id));
      } catch (err) {
        alert("שגיאה");
      }
    }
  };
  const openEditTrip = (trip) => {
    setEditingId(trip._id);
    setNewTrip({
      destination: trip.destination || "",
      // הגנה למקרה שהתאריך חסר במסד הנתונים
      date: trip.date ? trip.date.split("T")[0] : "",
      price: trip.price || "",
      description: trip.description || "",
      image: trip.image || "",
      maxParticipants: trip.maxParticipants || 20,
    });
    setShowTripModal(true);
  };
  const openNewTrip = () => {
    setEditingId(null);
    setNewTrip({
      destination: "",
      date: "",
      price: "",
      description: "",
      image: "",
      maxParticipants: 20,
    });
    setShowTripModal(true);
  };
  const handleSaveTrip = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/trips/${editingId}`, newTrip);
        setAllTrips(allTrips.map((t) => (t._id === editingId ? res.data : t)));
      } else {
        const res = await api.post("/trips", newTrip);
        setAllTrips([...allTrips, res.data]);
      }
      setShowTripModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- פונקציות ניהול קורסים ---
  const fetchAllCourses = async () => {
    try {
      const res = await api.get("/courses");
      setAllCourses(res.data);
      setManagementView("courses");
    } catch (err) {
      alert("שגיאה");
    }
  };
  const handleDeleteCourse = async (id) => {
    if (window.confirm("למחוק?")) {
      try {
        await api.delete(`/courses/${id}`);
        setAllCourses(allCourses.filter((c) => c._id !== id));
      } catch (err) {
        alert("שגיאה");
      }
    }
  };
  const openEditCourse = (course) => {
    setEditingId(course._id);
    setNewCourse({
      title: course.title || "",
      // הגנה למקרה שהתאריך חסר במסד הנתונים
      startDate: course.startDate ? course.startDate.split("T")[0] : "",
      price: course.price || "",
      description: course.description || "",
      image: course.image || "",
      maxParticipants: course.maxParticipants || 30,
    });
    setShowCourseModal(true);
  };
  const openNewCourse = () => {
    setEditingId(null);
    setNewCourse({
      title: "",
      description: "",
      price: "",
      startDate: "",
      image: "",
      maxParticipants: 30,
    });
    setShowCourseModal(true);
  };
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/courses/${editingId}`, newCourse);
        setAllCourses(
          allCourses.map((c) => (c._id === editingId ? res.data : c))
        );
      } else {
        const res = await api.post("/courses", newCourse);
        setAllCourses([...allCourses, res.data]);
      }
      setShowCourseModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- פונקציות ניהול פורום ---
  const fetchAllPosts = async () => {
    try {
      const res = await api.get("/blog?all=true");
      setAllPosts(res.data);
      setManagementView("blog");
    } catch (err) {
      alert("שגיאה בטעינת הפוסטים");
    }
  };
  const handleApprovePost = async (id) => {
    try {
      const res = await api.put(`/blog/${id}/approve`);
      setAllPosts(allPosts.map((p) => (p._id === id ? res.data : p)));
      alert("הפוסט אושר בהצלחה! ✅");
    } catch (err) {
      alert("שגיאה באישור הפוסט");
    }
  };
  const handleDeletePost = async (id) => {
    if (window.confirm("האם למחוק את הפוסט?")) {
      try {
        await api.delete(`/blog/${id}`);
        setAllPosts(allPosts.filter((p) => p._id !== id));
      } catch (err) {
        alert("שגיאה במחיקה");
      }
    }
  };

  // --- ✅ פונקציות חדשות לניהול משתתפים (טיולים וקורסים) ---
  const openParticipants = (item, type) => {
    setSelectedItemForParticipants(item);
    setParticipantsType(type);
    setManagementView("participants");
  };

  const handleParticipantStatus = async (userId, newStatus) => {
    try {
      const endpoint = participantsType === "trip" ? "trips" : "courses";
      const res = await api.put(
        `/${endpoint}/${selectedItemForParticipants._id}/participants/${userId}`,
        { status: newStatus }
      );

      // עדכון הסטייט המקומי עם המידע החדש מהשרת
      setSelectedItemForParticipants(res.data);

      // עדכון גם ברשימה הראשית
      if (participantsType === "trip") {
        setAllTrips(
          allTrips.map((t) => (t._id === res.data._id ? res.data : t))
        );
      } else {
        setAllCourses(
          allCourses.map((c) => (c._id === res.data._id ? res.data : c))
        );
      }
      alert(`המשתתף ${newStatus === "approved" ? "אושר" : "נדחה"} בהצלחה!`);
    } catch (err) {
      alert("שגיאה בעדכון הסטטוס: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="admin-container">
        <p>טוען נתונים...</p>
      </div>
    );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛠️ פאנל ניהול ({isEmployee ? "עובד" : "מנהל"})</h1>
      </div>

      <div className="admin-tabs">
        {!isEmployee && (
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 סטטיסטיקות
          </button>
        )}
        <button
          className={`tab-btn ${activeTab === "management" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("management");
            setManagementView("menu");
          }}
        >
          📝 ניהול תוכן
        </button>
      </div>

      <div className="tab-content">
        {/* דשבורד */}
        {!isEmployee && activeTab === "dashboard" && (
          <div className="charts-grid">
            <div className="chart-card">
              <h3>נרשמים לטיולים</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tripsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>נרשמים לקורסים</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={coursesData}
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {coursesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ניהול תוכן */}
        {activeTab === "management" && (
          <>
            {managementView === "menu" && (
              <div className="management-grid">
                <div className="manage-card">
                  <h2>🏄‍♂️ ניהול טיולים</h2>
                  <button className="action-btn" onClick={fetchAllTrips}>
                    כניסה
                  </button>
                </div>
                <div className="manage-card">
                  <h2>🎓 ניהול קורסים</h2>
                  <button className="action-btn" onClick={fetchAllCourses}>
                    כניסה
                  </button>
                </div>
                <div className="manage-card">
                  <h2>💬 ניהול פורום</h2>
                  <button className="action-btn" onClick={fetchAllPosts}>
                    כניסה
                  </button>
                </div>
              </div>
            )}

            {/* טבלת טיולים - הוספתי כפתור ניהול משתתפים */}
            {managementView === "trips" && (
              <div className="table-container">
                <div className="table-header">
                  <button
                    className="back-btn"
                    onClick={() => setManagementView("menu")}
                  >
                    ➡️ חזור
                  </button>
                  <h2>ניהול טיולים</h2>
                  <button className="add-btn" onClick={openNewTrip}>
                    + חדש
                  </button>
                </div>
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>יעד</th>
                      <th>תאריך</th>
                      <th>מחיר</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTrips.map((t) => (
                      <tr key={t._id}>
                        <td>{t.destination}</td>
                        <td>
                          {t.date
                            ? new Date(t.date).toLocaleDateString()
                            : "לא הוזן תאריך"}
                        </td>
                        <td>{t.price}</td>
                        <td>
                          <button
                            className="edit-btn-small"
                            onClick={() => openEditTrip(t)}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn-small"
                            onClick={() => handleDeleteTrip(t._id)}
                          >
                            🗑️
                          </button>
                          <button
                            style={{
                              backgroundColor: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px",
                              marginLeft: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => openParticipants(t, "trip")}
                          >
                            👥 משתתפים
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* טבלת קורסים - הוספתי כפתור ניהול משתתפים */}
            {managementView === "courses" && (
              <div className="table-container">
                <div className="table-header">
                  <button
                    className="back-btn"
                    onClick={() => setManagementView("menu")}
                  >
                    ➡️ חזור
                  </button>
                  <h2>ניהול קורסים</h2>
                  <button className="add-btn" onClick={openNewCourse}>
                    + חדש
                  </button>
                </div>
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>שם</th>
                      <th>תאריך</th>
                      <th>מחיר</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCourses.map((c) => (
                      <tr key={c._id}>
                        <td>{c.title}</td>
                        <td>
                          {c.startDate
                            ? new Date(c.startDate).toLocaleDateString()
                            : "לא הוזן תאריך"}
                        </td>
                        <td>{c.price}</td>
                        <td>
                          <button
                            className="edit-btn-small"
                            onClick={() => openEditCourse(c)}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn-small"
                            onClick={() => handleDeleteCourse(c._id)}
                          >
                            🗑️
                          </button>
                          <button
                            style={{
                              backgroundColor: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px",
                              marginLeft: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => openParticipants(c, "course")}
                          >
                            👥 משתתפים
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ✅ מסך ניהול משתתפים חדש ✅ */}
            {managementView === "participants" &&
              selectedItemForParticipants && (
                <div className="table-container">
                  <div className="table-header">
                    <button
                      className="back-btn"
                      onClick={() =>
                        setManagementView(
                          participantsType === "trip" ? "trips" : "courses"
                        )
                      }
                    >
                      ➡️ חזור לרשימה
                    </button>
                    <h2>
                      משתתפים ב:{" "}
                      {selectedItemForParticipants.destination ||
                        selectedItemForParticipants.title}
                    </h2>
                  </div>
                  {selectedItemForParticipants.participants &&
                  selectedItemForParticipants.participants.length > 0 ? (
                    <table className="management-table">
                      <thead>
                        <tr>
                          <th>שם</th>
                          <th>אימייל</th>
                          <th>תאריך הרשמה</th>
                          <th>הצהרת בריאות</th>
                          <th>סטטוס</th>
                          <th>פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedItemForParticipants.participants.map((p) => (
                          <tr key={p._id}>
                            <td>{p.userId?.name || "לא זמין"}</td>
                            <td>{p.userId?.email || "לא זמין"}</td>
                            <td>
                              {new Date(
                                p.joinedAt || p.enrolledAt
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              {p.healthDeclaration?.declared ? "✅" : "❌"}
                            </td>
                            <td>
                              {p.status === "approved" ? (
                                <span
                                  style={{ color: "green", fontWeight: "bold" }}
                                >
                                  מאושר ✅
                                </span>
                              ) : p.status === "rejected" ? (
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  נדחה ❌
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "orange",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ממתין ⏳
                                </span>
                              )}
                            </td>
                            <td>
                              {p.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleParticipantStatus(
                                        p.userId._id,
                                        "approved"
                                      )
                                    }
                                    style={{
                                      backgroundColor: "#28a745",
                                      color: "white",
                                      border: "none",
                                      padding: "5px",
                                      borderRadius: "5px",
                                      marginLeft: "5px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    אשר
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleParticipantStatus(
                                        p.userId._id,
                                        "rejected"
                                      )
                                    }
                                    style={{
                                      backgroundColor: "#dc3545",
                                      color: "white",
                                      border: "none",
                                      padding: "5px",
                                      borderRadius: "5px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    דחה
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ textAlign: "center", padding: "20px" }}>
                      עדיין אין נרשמים.
                    </p>
                  )}
                </div>
              )}

            {/* טבלת פורום */}
            {managementView === "blog" && (
              <div className="table-container">
                <div className="table-header">
                  <button
                    className="back-btn"
                    onClick={() => setManagementView("menu")}
                  >
                    ➡️ חזור
                  </button>
                  <h2>ניהול פורום</h2>
                </div>
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>כותרת</th>
                      <th>מאת</th>
                      <th>סטטוס</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPosts.map((p) => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>{p.authorName}</td>
                        <td>
                          {p.isApproved ? (
                            <span style={{ color: "green" }}>פורסם ✅</span>
                          ) : (
                            <span style={{ color: "orange" }}>ממתין ⏳</span>
                          )}
                        </td>
                        <td>
                          {!p.isApproved && (
                            <button
                              onClick={() => handleApprovePost(p._id)}
                              style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                marginLeft: "10px",
                              }}
                            >
                              ✅ אשר
                            </button>
                          )}
                          <button onClick={() => handleDeletePost(p._id)}>
                            🗑️ מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* מודלים של טיול וקורס */}
      {showTripModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSaveTrip}>
              <input
                value={newTrip.destination}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, destination: e.target.value })
                }
                placeholder="יעד"
              />
              <input
                type="date"
                value={newTrip.date}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, date: e.target.value })
                }
              />
              <input
                value={newTrip.price}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, price: e.target.value })
                }
                placeholder="מחיר"
              />
              <input
                value={newTrip.maxParticipants}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, maxParticipants: e.target.value })
                }
                placeholder="משתתפים"
              />
              <input
                value={newTrip.image}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, image: e.target.value })
                }
                placeholder="תמונה"
              />
              <textarea
                value={newTrip.description}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, description: e.target.value })
                }
                placeholder="תיאור"
              />
              <button type="submit">שמור</button>
              <button type="button" onClick={() => setShowTripModal(false)}>
                ביטול
              </button>
            </form>
          </div>
        </div>
      )}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSaveCourse}>
              <input
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                placeholder="שם"
              />
              <input
                type="date"
                value={newCourse.startDate}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, startDate: e.target.value })
                }
              />
              <input
                value={newCourse.price}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, price: e.target.value })
                }
                placeholder="מחיר"
              />
              <input
                value={newCourse.maxParticipants}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    maxParticipants: e.target.value,
                  })
                }
                placeholder="משתתפים"
              />
              <input
                value={newCourse.image}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, image: e.target.value })
                }
                placeholder="תמונה"
              />
              <textarea
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="תיאור"
              />
              <button type="submit">שמור</button>
              <button type="button" onClick={() => setShowCourseModal(false)}>
                ביטול
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
