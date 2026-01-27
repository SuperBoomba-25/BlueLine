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
  const [allPosts, setAllPosts] = useState([]); // כאן יישמרו הפוסטים

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

  // --- טעינה ראשונית ---
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

  // --- פונקציות ניהול טיולים וקורסים ---
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
      destination: trip.destination,
      date: trip.date.split("T")[0],
      price: trip.price,
      description: trip.description,
      image: trip.image,
      maxParticipants: trip.maxParticipants,
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
      title: course.title,
      startDate: course.startDate.split("T")[0],
      price: course.price,
      description: course.description,
      image: course.image,
      maxParticipants: course.maxParticipants,
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

  // --- ✅ ניהול פורום (החלק שתוקן) ---
  const fetchAllPosts = async () => {
    try {
      // כאן היה החסר: הוספנו ?all=true כדי להביא גם פוסטים לא מאושרים
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
      // עדכון הטבלה המקומית
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
              <h3>נרשמים</h3>
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
              <h3>קורסים</h3>
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
                  <p>אישור ומחיקת פוסטים</p>
                  <button className="action-btn" onClick={fetchAllPosts}>
                    כניסה
                  </button>
                </div>
              </div>
            )}

            {/* טבלאות טיולים וקורסים */}
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
                        <td>{new Date(t.date).toLocaleDateString()}</td>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                        <td>{new Date(c.startDate).toLocaleDateString()}</td>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ✅ טבלת הפורום המתוקנת ✅ */}
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

                {allPosts.length === 0 ? (
                  <p style={{ textAlign: "center", padding: "20px" }}>
                    אין פוסטים להצגה
                  </p>
                ) : (
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>כותרת</th>
                        <th>מאת</th>
                        <th>סטטוס</th> {/* העמודה שהייתה חסרה לך */}
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
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                פורסם ✅
                              </span>
                            ) : (
                              <span
                                style={{ color: "orange", fontWeight: "bold" }}
                              >
                                ממתין לאישור ⏳
                              </span>
                            )}
                          </td>
                          <td>
                            {!p.isApproved && (
                              <button
                                onClick={() => handleApprovePost(p._id)}
                                style={{
                                  backgroundColor: "#28a745",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  marginLeft: "10px",
                                }}
                              >
                                ✅ אשר
                              </button>
                            )}
                            <button
                              className="delete-btn-small"
                              onClick={() => handleDeletePost(p._id)}
                            >
                              🗑️ מחק
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* מודלים לטיולים וקורסים... */}
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
