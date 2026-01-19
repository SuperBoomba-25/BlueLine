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
import api from "../api"; // וודא שהנתיב ל-api נכון
import "./AdminPage.css";

// צבעים לגרף העוגה
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // State לנתונים האמיתיים מהשרת
  const [tripsData, setTripsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // משיכת נתונים מהשרת בעת טעינת הדף
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ביצוע שתי הקריאות לשרת במקביל (יעיל יותר)
        const [tripsRes, coursesRes] = await Promise.all([
          api.get("/trips/stats"),
          api.get("/courses/stats"),
        ]);

        setTripsData(tripsRes.data);
        setCoursesData(coursesRes.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // תצוגת טעינה בזמן שמביאים נתונים
  if (loading) {
    return (
      <div className="admin-container">
        <p
          className="loading-text"
          style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2rem" }}
        >
          טוען נתונים מהמערכת...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛠️ פאנל ניהול (Admin)</h1>
        <p>ברוך הבא ללוח הבקרה. צפה בנתונים בזמן אמת ונהל את המערכת.</p>
      </div>

      {/* תפריט טאבים */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 סטטיסטיקות וגרפים
        </button>
        <button
          className={`tab-btn ${activeTab === "management" ? "active" : ""}`}
          onClick={() => setActiveTab("management")}
        >
          📝 ניהול תוכן
        </button>
      </div>

      <div className="tab-content">
        {/* --- טאב 1: גרפים (מחובר לנתונים אמיתיים!) --- */}
        {activeTab === "dashboard" && (
          <div className="charts-grid">
            {/* גרף עמודות - נרשמים לטיולים */}
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
                <p style={{ textAlign: "center", color: "#666" }}>
                  אין נתונים להצגה כרגע.
                </p>
              )}
            </div>

            {/* גרף עוגה - נרשמים לקורסים */}
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
                <p style={{ textAlign: "center", color: "#666" }}>
                  אין נתונים להצגה כרגע.
                </p>
              )}
            </div>
          </div>
        )}

        {/* --- טאב 2: כרטיסי ניהול --- */}
        {activeTab === "management" && (
          <div className="management-grid">
            <div className="manage-card">
              <h2>👥 ניהול משתמשים</h2>
              <p>צפייה בכל המשתמשים הרשומים, עדכון הרשאות ומחיקה.</p>
              <button className="action-btn">כניסה לניהול משתמשים</button>
            </div>

            <div className="manage-card">
              <h2>🏄‍♂️ ניהול טיולים ופוסטים</h2>
              <p>הוספת טיולים חדשים למערכת, עריכת פרטים ומחיקת ישנים.</p>
              <button className="action-btn">כניסה לניהול טיולים</button>
            </div>

            <div className="manage-card">
              <h2>🎓 ניהול קורסים</h2>
              <p>פתיחת קורסים חדשים, עדכון תאריכים ורשימות משתתפים.</p>
              <button className="action-btn">כניסה לניהול קורסים</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
