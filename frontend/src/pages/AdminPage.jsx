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

  // ניהול תצוגה: 'menu', 'trips', 'courses', 'blog', 'users'
  const [managementView, setManagementView] = useState("menu");

  // --- States לנתונים ---
  const [tripsData, setTripsData] = useState([]); // לגרפים
  const [coursesData, setCoursesData] = useState([]); // לגרפים

  const [allTrips, setAllTrips] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // אם תרצה בעתיד

  const [loading, setLoading] = useState(true);

  // --- States למודלים (Popups) ---
  const [showTripModal, setShowTripModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // אובייקטים ליצירה חדשה
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

  // --- טעינה ראשונית (גרפים) ---
  useEffect(() => {
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
  }, []);

  // =================================================
  // פונקציות ניהול טיולים (Trips)
  // =================================================
  const fetchAllTrips = async () => {
    try {
      const res = await api.get("/trips");
      setAllTrips(res.data);
      setManagementView("trips");
    } catch (err) {
      alert("שגיאה בטעינת הטיולים");
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm("למחוק את הטיול?")) {
      try {
        await api.delete(`/trips/${id}`);
        setAllTrips(allTrips.filter((t) => t._id !== id));
      } catch (err) {
        alert("שגיאה במחיקה");
      }
    }
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/trips", newTrip);
      setAllTrips([...allTrips, res.data]);
      setShowTripModal(false);
      setNewTrip({
        destination: "",
        date: "",
        price: "",
        description: "",
        image: "",
        maxParticipants: 20,
      });
      alert("הטיול נוסף בהצלחה!");
    } catch (err) {
      alert("שגיאה בהוספה: " + err.message);
    }
  };

  // =================================================
  // פונקציות ניהול קורסים (Courses)
  // =================================================
  const fetchAllCourses = async () => {
    try {
      const res = await api.get("/courses");
      setAllCourses(res.data);
      setManagementView("courses");
    } catch (err) {
      alert("שגיאה בטעינת הקורסים");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הקורס?")) {
      try {
        await api.delete(`/courses/${id}`);
        setAllCourses(allCourses.filter((c) => c._id !== id));
      } catch (err) {
        alert("שגיאה במחיקה");
      }
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/courses", newCourse);
      setAllCourses([...allCourses, res.data]);
      setShowCourseModal(false);
      setNewCourse({
        title: "",
        description: "",
        price: "",
        startDate: "",
        image: "",
        maxParticipants: 30,
      });
      alert("הקורס נוסף בהצלחה!");
    } catch (err) {
      alert("שגיאה בהוספה: " + err.message);
    }
  };

  // =================================================
  // פונקציות ניהול פורום/בלוג (Blog)
  // =================================================
  const fetchAllPosts = async () => {
    try {
      // נניח שהנתיב הוא /blog או /posts
      const res = await api.get("/blog"); // או הנתיב המתאים אצלך
      setAllPosts(res.data);
      setManagementView("blog");
    } catch (err) {
      alert("שגיאה בטעינת הפוסטים");
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("למחוק את הפוסט הזה לצמיתות?")) {
      try {
        await api.delete(`/blog/${id}`); // או הנתיב המתאים למחיקה
        setAllPosts(allPosts.filter((p) => p._id !== id));
      } catch (err) {
        alert("שגיאה במחיקת הפוסט");
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
        <h1>🛠️ פאנל ניהול (Admin)</h1>
        <p>מערכת ניהול מקיפה</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 סטטיסטיקות
        </button>
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
        {/* === טאב גרפים === */}
        {activeTab === "dashboard" && (
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

        {/* === טאב ניהול === */}
        {activeTab === "management" && (
          <>
            {/* 1. תפריט ראשי */}
            {managementView === "menu" && (
              <div className="management-grid">
                <div className="manage-card">
                  <h2>🏄‍♂️ ניהול טיולים</h2>
                  <p>צפייה, הוספה ומחיקה של טיולים במערכת.</p>
                  <button className="action-btn" onClick={fetchAllTrips}>
                    כניסה לניהול טיולים
                  </button>
                </div>

                <div className="manage-card">
                  <h2>🎓 ניהול קורסים</h2>
                  <p>ניהול סילבוס, תאריכי פתיחה ונרשמים.</p>
                  <button className="action-btn" onClick={fetchAllCourses}>
                    כניסה לניהול קורסים
                  </button>
                </div>

                <div className="manage-card">
                  <h2>💬 ניהול פורום</h2>
                  <p>מודרציה של דיונים ומחיקת תוכן לא הולם.</p>
                  <button className="action-btn" onClick={fetchAllPosts}>
                    כניסה לניהול פורום
                  </button>
                </div>
              </div>
            )}

            {/* 2. טבלת טיולים */}
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
                  <button
                    className="add-btn"
                    onClick={() => setShowTripModal(true)}
                  >
                    + הוסף טיול
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>תמונה</th>
                        <th>יעד</th>
                        <th>תאריך</th>
                        <th>מחיר</th>
                        <th>נרשמים</th>
                        <th>פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTrips.map((trip) => (
                        <tr key={trip._id}>
                          <td>
                            {trip.image ? (
                              <img
                                src={trip.image}
                                alt=""
                                className="table-img"
                              />
                            ) : (
                              "❌"
                            )}
                          </td>
                          <td>
                            <strong>{trip.destination}</strong>
                          </td>
                          <td>{new Date(trip.date).toLocaleDateString()}</td>
                          <td>₪{trip.price}</td>
                          <td>{trip.participants?.length || 0}</td>
                          <td>
                            <button
                              className="delete-btn-small"
                              onClick={() => handleDeleteTrip(trip._id)}
                            >
                              🗑️ מחק
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. טבלת קורסים (חדש!) */}
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
                  <button
                    className="add-btn"
                    onClick={() => setShowCourseModal(true)}
                  >
                    + הוסף קורס
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>תמונה</th>
                        <th>שם הקורס</th>
                        <th>תאריך פתיחה</th>
                        <th>מחיר</th>
                        <th>נרשמים</th>
                        <th>פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCourses.map((course) => (
                        <tr key={course._id}>
                          <td>
                            {course.image ? (
                              <img
                                src={course.image}
                                alt=""
                                className="table-img"
                              />
                            ) : (
                              "❌"
                            )}
                          </td>
                          <td>
                            <strong>{course.title}</strong>
                          </td>
                          <td>
                            {new Date(course.startDate).toLocaleDateString()}
                          </td>
                          <td>₪{course.price}</td>
                          <td>{course.participants?.length || 0}</td>
                          <td>
                            <button
                              className="delete-btn-small"
                              onClick={() => handleDeleteCourse(course._id)}
                            >
                              🗑️ מחק
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. טבלת פוסטים/בלוג (חדש!) */}
            {managementView === "blog" && (
              <div className="table-container">
                <div className="table-header">
                  <button
                    className="back-btn"
                    onClick={() => setManagementView("menu")}
                  >
                    ➡️ חזור
                  </button>
                  <h2>ניהול פוסטים ודיונים</h2>
                  {/* בבלוג לרוב רק מוחקים, הוספה נעשית מהאתר עצמו */}
                </div>
                <div className="table-responsive">
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>כותרת</th>
                        <th>מחבר</th>
                        <th>תאריך</th>
                        <th>פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPosts.map((post) => (
                        <tr key={post._id}>
                          <td>
                            <strong>{post.title}</strong>
                          </td>
                          <td>{post.authorName || "אנונימי"}</td>
                          <td>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="delete-btn-small"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              🗑️ מחק
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {allPosts.length === 0 && (
                    <p style={{ textAlign: "center" }}>אין פוסטים כרגע.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* === מודל הוספת טיול === */}
      {showTripModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>✈️ הוספת טיול חדש</h3>
            <form onSubmit={handleAddTrip}>
              <div className="form-group">
                <label>יעד:</label>
                <input
                  type="text"
                  required
                  value={newTrip.destination}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, destination: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>תאריך:</label>
                  <input
                    type="date"
                    required
                    value={newTrip.date}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, date: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>מחיר:</label>
                  <input
                    type="number"
                    required
                    value={newTrip.price}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>משתתפים:</label>
                <input
                  type="number"
                  value={newTrip.maxParticipants}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, maxParticipants: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>תמונה (URL):</label>
                <input
                  type="text"
                  value={newTrip.image}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, image: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>תיאור:</label>
                <textarea
                  rows="3"
                  value={newTrip.description}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  שמור
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

      {/* === מודל הוספת קורס (חדש!) === */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🎓 הוספת קורס חדש</h3>
            <form onSubmit={handleAddCourse}>
              <div className="form-group">
                <label>שם הקורס:</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>תאריך פתיחה:</label>
                  <input
                    type="date"
                    required
                    value={newCourse.startDate}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>מחיר:</label>
                  <input
                    type="number"
                    required
                    value={newCourse.price}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>מקסימום משתתפים:</label>
                <input
                  type="number"
                  value={newCourse.maxParticipants}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      maxParticipants: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>תמונה (URL):</label>
                <input
                  type="text"
                  value={newCourse.image}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, image: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>תיאור:</label>
                <textarea
                  rows="3"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  שמור קורס
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
