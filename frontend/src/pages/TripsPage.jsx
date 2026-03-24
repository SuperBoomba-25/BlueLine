import React, { useState, useEffect } from "react";
import api from "../api";
import "./TripsPage.css";
import TripRegistrationModal from "./TripRegistrationModal";

function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTrip, setSelectedTrip] = useState(null);

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

  const handleEnrollClick = (trip) => {
    if (!user) {
      alert("יש להתחבר כדי להירשם לטיול");
      return;
    }
    setSelectedTrip(trip);
  };

  const handleConfirmEnrollment = async (data) => {
    if (!selectedTrip) return;
    try {
      const res = await api.post(`/trips/${selectedTrip._id}/enroll`, {
        healthData: data.healthData,
        paymentData: data.paymentData,
      });

      alert(res.data.message);
      setTrips(
        trips.map((t) => (t._id === selectedTrip._id ? res.data.trip : t))
      );
      setSelectedTrip(null);
    } catch (err) {
      alert("שגיאה בהרשמה: " + (err.response?.data?.message || err.message));
      setSelectedTrip(null);
    }
  };

  // ✅ פונקציה חכמה לטיפול בתאריכים שגויים או חסרים
  const formatDate = (dateString) => {
    if (!dateString) return "תאריך יפורסם בהמשך ⏳";
    const date = new Date(dateString);
    // בודק אם התאריך לא חוקי או שווה ל-1970 (תקלת מערכת נפוצה)
    if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
      return "תאריך יפורסם בהמשך ⏳";
    }
    return `📅 ${date.toLocaleDateString("he-IL")}`;
  };

  if (loading)
    return (
      <div className="trips-container">
        <p className="loading-text">טוען טיולי גלישה...</p>
      </div>
    );

  return (
    <div className="trips-container">
      <div className="trips-header">
        <h1>✈️ טיולי גלישה מסביב לעולם</h1>
        <p className="trips-intro">
          הצטרפו אלינו לחוויה בלתי נשכחת ביעדים הכי שווים!
        </p>
      </div>

      <div className="trips-grid">
        {trips.map((trip) => {
          const isUserRegistered = trip.participants?.some((p) => {
            const pId = p.userId?._id || p.userId;
            return pId === userId;
          });

          const myRegistration = trip.participants?.find(
            (p) => (p.userId?._id || p.userId) === userId
          );
          const myStatus = myRegistration ? myRegistration.status : null;
          const isFull = trip.participants?.length >= trip.maxParticipants;

          return (
            <div key={trip._id} className="trip-card">
              {trip.image ? (
                <img
                  src={trip.image}
                  alt={trip.destination}
                  className="trip-image"
                />
              ) : (
                <div className="trip-image-placeholder">🌊 תמונה בקרוב</div>
              )}

              {/* ✅ הותאם ל-CSS (trip-info) */}
              <div className="trip-info">
                <h3>{trip.destination}</h3>
                <p className="trip-date">{formatDate(trip.date)}</p>
                <p className="trip-description">{trip.description}</p>

                <div className="trip-footer">
                  <span className="trip-price">₪{trip.price}</span>

                  {isUserRegistered ? (
                    <button
                      disabled
                      className="register-btn registered"
                      style={{
                        backgroundColor:
                          myStatus === "approved" ? "#28a745" : "#fd7e14",
                        cursor: "default",
                      }}
                    >
                      {myStatus === "approved"
                        ? "✅ רשום לטיול"
                        : "⏳ ממתין לאישור"}
                    </button>
                  ) : isFull ? (
                    <button disabled className="register-btn full">
                      הטיול מלא
                    </button>
                  ) : (
                    // ✅ הותאם ל-CSS (register-btn)
                    <button
                      className="register-btn"
                      onClick={() => handleEnrollClick(trip)}
                    >
                      הרשמה לטיול ⬅️
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
