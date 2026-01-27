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

  // נתונים
  const [tripsData, setTripsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // מודלים (Popups)
  const [showTripModal, setShowTripModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // מצב עריכה (אם יש ID - עורכים, אם אין - יוצרים חדש)
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

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  // --- טעינה ראשונית (סטטיסטיקות) ---
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

  // ==========================================
  // לוגיקה לניהול טיולים (הוספה + עריכה)
  // ==========================================

  const fetchAllTrips = async () => {
    try {
      const res = await api.get("/trips");
      setAllTrips(res.data);
      setManagementView("trips");
    } catch (err) {
      alert("שגיאה בטעינת הטיולים");
    }
  };

  // פתיחת מודל לעריכה (ממלא את הטופס בפרטים קיימים)
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

  // פתיחת מודל ליצירה חדשה (מאפס את הטופס)
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
        // === עדכון (PUT) ===
        const res = await api.put(`/trips/${editingId}`, newTrip);
        setAllTrips(allTrips.map((t) => (t._id === editingId ? res.data : t)));
        alert("הטיול עודכן בהצלחה! ✅");
      } else {
        // === יצירה (POST) ===
        const res = await api.post("/trips", newTrip);
        setAllTrips([...allTrips, res.data]);
        alert("הטיול נוצר בהצלחה! 🎉");
      }
      setShowTripModal(false);
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm("האם למחוק את הטיול?")) {
      try {
        await api.delete(`/trips/${id}`);
        setAllTrips(allTrips.filter((t) => t._id !== id));
      } catch (err) {
        alert("שגיאה במחיקה");
      }
    }
  };

  // ==========================================
  // לוגיקה לניהול קורסים (הוספה + עריכה)
  // ==========================================

  const fetchAllCourses = async () => {
    try {
      const res = await api.get("/courses");
      setAllCourses(res.data);
      setManagementView("courses");
    } catch (err) {
      alert("שגיאה בטעינת הקורסים");
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
        alert("הקורס עודכן בהצלחה! ✅");
      } else {
        const res = await api.post("/courses", newCourse);
        setAllCourses([...allCourses, res.data]);
        alert("הקורס נוצר בהצלחה! 🎉");
      }
      setShowCourseModal(false);
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("האם למחוק את הקורס?")) {
      try {
        await api.delete(`/courses/${id}`);
        setAllCourses(allCourses.filter((c) => c._id !== id));
      } catch (err) {
        alert("שגיאה במחיקה");
      }
    }
  };

  // ==========================================
  // ניהול פורום
  // ==========================================
  const fetchAllPosts = async () => {
    try {
      const res = await api.get("/blog");
      setAllPosts(res.data);
      setManagementView("blog");
    } catch (err) {
      alert("שגיאה בטעינת הפוסטים");
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
        <p className="loading-text">טוען...</p>
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
        {/* === דשבורד === */}
        {!isEmployee && activeTab === "dashboard" && (
          <div className="charts-grid">
            <div className="chart-card">
              <h3>🏄‍♂️ נרשמים לטיולים</h3>
              {tripsData.length > 0 ? (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={tripsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        name="נרשמים"
                        fill="var(--primary-color)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="no-data">אין נתונים להצגה</p>
              )}
            </div>
            <div className="chart-card">
              <h3>🎓 התפלגות קורסים</h3>
              {coursesData.length > 0 ? (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={coursesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
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
              ) : (
                <p className="no-data">אין נתונים להצגה</p>
              )}
            </div>
          </div>
        )}

        {/* === ניהול תוכן === */}
        {activeTab === "management" && (
          <>
            {managementView === "menu" && (
              <div className="management-grid">
                <div className="manage-card">
                  <h2>🏄‍♂️ ניהול טיולים</h2>
                  <p>הוספה, עריכה ומחיקה של טיולים.</p>
                  <button className="action-btn" onClick={fetchAllTrips}>
                    כניסה
                  </button>
                </div>
                <div className="manage-card">
                  <h2>🎓 ניהול קורסים</h2>
                  <p>הוספה, עריכה ומחיקה של קורסים.</p>
                  <button className="action-btn" onClick={fetchAllCourses}>
                    כניסה
                  </button>
                </div>
                <div className="manage-card">
                  <h2>💬 ניהול פורום</h2>
                  <p>מחיקת פוסטים ודיונים.</p>
                  <button className="action-btn" onClick={fetchAllPosts}>
                    כניסה
                  </button>
                </div>
              </div>
            )}

            {/* טבלת טיולים - עם עריכה */}
            {managementView === "trips" && (
              <div className="table-container">
                <div className="table-header">
                  <button
                    className="back-btn"
                    onClick={() => setManagementView("menu")}
                  >
                    ➡️ חזור
                  </button>
                  <h2>רשימת הטיולים</h2>
                  <button className="add-btn" onClick={openNewTrip}>
                    + הוסף טיול
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
                        <td>₪{t.price}</td>
                        <td>
                          <button
                            className="edit-btn-small"
                            onClick={() => openEditTrip(t)}
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          >
                            ✏️ ערוך
                          </button>
                          <button
                            className="delete-btn-small"
                            onClick={() => handleDeleteTrip(t._id)}
                          >
                            🗑️ מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* טבלת קורסים - עם עריכה */}
            {managementView === "courses" && (
              <div className="table-container">
                <div className="table-header">
                  <button
                    className="back-btn"
                    onClick={() => setManagementView("menu")}
                  >
                    ➡️ חזור
                  </button>
                  <h2>רשימת הקורסים</h2>
                  <button className="add-btn" onClick={openNewCourse}>
                    + הוסף קורס
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
                        <td>₪{c.price}</td>
                        <td>
                          <button
                            className="edit-btn-small"
                            onClick={() => openEditCourse(c)}
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          >
                            ✏️ ערוך
                          </button>
                          <button
                            className="delete-btn-small"
                            onClick={() => handleDeleteCourse(c._id)}
                          >
                            🗑️ מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* טבלת בלוג */}
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
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPosts.map((p) => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>{p.authorName}</td>
                        <td>
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
              </div>
            )}
          </>
        )}
      </div>

      {/* מודל טיול (משותף ליצירה ועריכה) */}
      {showTripModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? "✏️ עריכת טיול" : "✈️ הוספת טיול חדש"}</h3>
            <form onSubmit={handleSaveTrip}>
              <input
                placeholder="יעד"
                required
                value={newTrip.destination}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, destination: e.target.value })
                }
              />
              <input
                type="date"
                required
                value={newTrip.date}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, date: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="מחיר"
                required
                value={newTrip.price}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, price: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="משתתפים"
                value={newTrip.maxParticipants}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, maxParticipants: e.target.value })
                }
              />
              <input
                placeholder="תמונה URL"
                value={newTrip.image}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, image: e.target.value })
                }
              />
              <textarea
                placeholder="תיאור"
                value={newTrip.description}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, description: e.target.value })
                }
              />
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {editingId ? "עדכן" : "שמור"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowTripModal(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* מודל קורס (משותף ליצירה ועריכה) */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? "✏️ עריכת קורס" : "🎓 הוספת קורס חדש"}</h3>
            <form onSubmit={handleSaveCourse}>
              <input
                placeholder="שם הקורס"
                required
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
              />
              <input
                type="date"
                required
                value={newCourse.startDate}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, startDate: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="מחיר"
                required
                value={newCourse.price}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, price: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="משתתפים"
                value={newCourse.maxParticipants}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    maxParticipants: e.target.value,
                  })
                }
              />
              <input
                placeholder="תמונה URL"
                value={newCourse.image}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, image: e.target.value })
                }
              />
              <textarea
                placeholder="תיאור"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
              />
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {editingId ? "עדכן" : "שמור"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCourseModal(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
