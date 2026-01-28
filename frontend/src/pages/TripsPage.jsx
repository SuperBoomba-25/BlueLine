import React, { useState, useEffect } from "react";
import api from "../api";
import "./TripsPage.css"; 
import TripRegistrationModal from "./TripRegistrationModal"; // ✅ הייבוא החדש והחשוב

function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ניהול המודל (החלון הקופץ)
  const [selectedTrip, setSelectedTrip] = useState(null);

  // שליפת פרטי המשתמש המחובר
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user ? user._id : null;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips");
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // 1. לחיצה על כפתור "הרשמה" -> רק פותחת את המודל (לא שולחת לשרת)
  const handleEnrollClick = (trip) => {
    if (!user) {
      alert("יש להתחבר כדי להירשם לטיול");
      return;
    }
    setSelectedTrip(trip);
  };

  // 2. אישור סופי מהמודל -> שליחה לשרת עם הנתונים
  const handleConfirmEnrollment = async (data) => {
    if (!selectedTrip) return;

    try {
      const res = await api.post(`/trips/${selectedTrip._id}/enroll`, {
        healthData: data.healthData,
        paymentData: data.paymentData,
      });

      alert(res.data.message); // הודעה: "הבקשה התקבלה וממתינה לאישור..."

      // עדכון הטיול ברשימה המקומית (כדי שהכפתור יהפוך ל"ממתין")
      setTrips(trips.map(t => t._id === selectedTrip._id ? res.data.trip : t));
      
      setSelectedTrip(null); // סגירת המודל

    } catch (err) {
      alert("שגיאה בהרשמה: " + (err.response?.data?.message || err.message));
      setSelectedTrip(null);
    }
  };

  if (loading) return <div className="trips-container"><p>טוען טיולים...</p></div>;

  return (
    <div className="trips-container">
      <div className="trips-header">
        <h1>✈️ טיולי גלישה מסביב לעולם</h1>
        <p>הצטרפו אלינו לחוויה בלתי נשכחת ביעדים הכי שווים!</p>
      </div>

      <div className="trips-grid">
        {trips.map((trip) => {
          // --- לוגיקה חכמה לכפתורים ---
          
          // בדיקה אם המשתמש רשום (מתמודד גם עם אובייקטים וגם עם מחרוזות)
          const isUserRegistered = trip.participants.some(p => {
             const pId = p.userId?._id || p.userId; 
             return pId === userId;
          });

          // מציאת הסטטוס אם הוא רשום (approved/pending)
          const myRegistration = trip.participants.find(p => (p.userId?._id || p.userId) === userId);
          const myStatus = myRegistration ? myRegistration.status : null;

          const isFull = trip.participants.length >= trip.maxParticipants;

          return (
            <div key={trip._id} className="trip-card">
              {trip.image && <img src={trip.image} alt={trip.destination} className="trip-image" />}
              <div className="trip-content">
                <h2>{trip.destination}</h2>
                <p className="trip-date">📅 {new Date(trip.date).toLocaleDateString()}</p>
                <p className="trip-desc">{trip.description}</p>
                <div className="trip-footer">
                  <span className="trip-price">{trip.price} ₪</span>
                  
                  {isUserRegistered ? (
                    // אם רשום - הצג כפתור לפי הסטטוס (ירוק או כתום)
                    <button disabled className="enroll-btn registered" style={{
                        backgroundColor: myStatus === 'approved' ? '#28a745' : '#fd7e14', 
                        cursor: 'default',
                        opacity: 1
                    }}>
                       {myStatus === 'approved' ? '✅ רשום לטיול' : '⏳ ממתין לאישור'}
                    </button>
                  ) : isFull ? (
                    <button disabled className="enroll-btn full">הטיול מלא</button>
                  ) : (
                    // אם לא רשום ויש מקום - כפתור הרשמה רגיל
                    <button className="enroll-btn" onClick={() => handleEnrollClick(trip)}>
                      הרשמה לטיול ⬅️
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* הרכיב של המודל הקופץ - מוצג רק אם נבחר טיול */}
      {selectedTrip && (
        <TripRegistrationModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onConfirm={handleConfirmEnrollment}
        />
      )}
    </div>
  );
}

export default TripsPage;