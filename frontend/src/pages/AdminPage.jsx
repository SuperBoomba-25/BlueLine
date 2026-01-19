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

  // טפסים ליצירה חדשה
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

  // ==========================================
  // 🪄 פונקציית הקסם לשחזור נתונים (Seeding)
  // ==========================================
  const handleSeedData = async () => {
    if (
      !window.confirm(
        "האם להוסיף נתונים לדוגמה (טיולים, קורסים ופוסטים) למסד הנתונים?"
      )
    )
      return;

    try {
      // 1. נתונים לטיולים
      const dummyTrips = [
        {
          destination: "המלדיביים",
          date: "2025-11-15",
          price: 5500,
          description: "טיול גלישה חלומי באיים המלדיביים, כולל הדרכה וצילום.",
          image:
            "https://images.unsplash.com/photo-1537551080512-fb7dd14fbf90?auto=format&fit=crop&w=800&q=80",
          maxParticipants: 15,
        },
        {
          destination: "סרי לנקה",
          date: "2025-12-01",
          price: 4200,
          description: "חווית גלישה ואוכל מקומי בחופים הדרומיים של סרי לנקה.",
          image:
            "https://images.unsplash.com/photo-1516216628259-22240502a50a?auto=format&fit=crop&w=800&q=80",
          maxParticipants: 12,
        },
        {
          destination: "פורטוגל",
          date: "2026-03-10",
          price: 3800,
          description: "גלישת גלים ארוכים בחוף המערבי של פורטוגל.",
          image:
            "https://images.unsplash.com/photo-1528150244723-5e92751f8982?auto=format&fit=crop&w=800&q=80",
          maxParticipants: 10,
        },
      ];

      // 2. נתונים לקורסים
      const dummyCourses = [
        {
          title: "קורס מתחילים",
          startDate: "2025-06-01",
          price: 1200,
          description: "ללמוד את הבסיס: חתירה, עמידה והבנת הים.",
          image:
            "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
          maxParticipants: 20,
        },
        {
          title: "קורס מתקדמים",
          startDate: "2025-07-15",
          price: 1500,
          description: "שיפור טכניקה, פניות וקריאת גלים מתקדמת.",
          image:
            "https://images.unsplash.com/photo-1415899285072-5264b3017a86?auto=format&fit=crop&w=800&q=80",
          maxParticipants: 10,
        },
      ];

      // 3. נתונים לבלוג
      const dummyPosts = [
        {
          title: "איך לבחור גלשן?",
          content: "המדריך המלא לבחירת הגלשן הראשון שלך...",
          image:
            "https://images.unsplash.com/photo-1455919426861-c00322303254?auto=format&fit=crop&w=800&q=80",
        },
        {
          title: "5 החופים הכי טובים בארץ",
          content: "סקירה של החופים הטובים ביותר לגלישה בישראל...",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        },
      ];

      // שליחה לשרת בלולאה
      for (const trip of dummyTrips) await api.post("/trips", trip);
      for (const course of dummyCourses) await api.post("/courses", course);
      for (const post of dummyPosts) await api.post("/blog", post);

      alert("🎉 הנתונים נטענו בהצלחה! רענן את הדף כדי לראות.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("הייתה בעיה בטעינת הנתונים (בדוק ב-Console).");
    }
  };
  // ==========================================

  // --- פונקציות ניהול (אותן פונקציות מקודם) ---
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
    if (window.confirm("למחוק?")) {
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
      alert("נוסף!");
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

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
    if (window.confirm("למחוק?")) {
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
      alert("נוסף!");
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

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
    if (window.confirm("למחוק?")) {
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

        {/* כפתור זמני לטעינת נתונים - תלחץ עליו פעם אחת ואז תוכל למחוק אותו */}
        {!isEmployee && (
          <button
            onClick={handleSeedData}
            style={{
              background: "orange",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            ⚙️ לחץ כאן כדי למלא את האתר בנתונים (פעם אחת)
          </button>
        )}
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
                  <p>הוספה ומחיקה של טיולים.</p>
                  <button className="action-btn" onClick={fetchAllTrips}>
                    כניסה
                  </button>
                </div>
                <div className="manage-card">
                  <h2>🎓 ניהול קורסים</h2>
                  <p>הוספה ומחיקה של קורסים.</p>
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

            {/* טבלאות */}
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

      {/* מודלים */}
      {showTripModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>הוספת טיול</h3>
            <form onSubmit={handleAddTrip}>
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

      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>הוספת קורס</h3>
            <form onSubmit={handleAddCourse}>
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
                  שמור
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
