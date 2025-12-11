import React, { useEffect, useState } from "react";
import api from "../api"; // axios עם baseURL = '/api'
import "./TripsPage.css";

function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/trips")
      .then((res) => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("שגיאה בטעינת הטיולים.");
        setLoading(false);
      });
  }, []);

  const registerToTrip = async (tripId) => {
    try {
      const res = await api.post(`/trips/${tripId}/register`);
      setMessage(res.data.message);

      // עדכון מקומי של משתתפים
      setTrips((prev) =>
        prev.map((t) =>
          t._id === tripId
            ? { ...t, participants: [...t.participants, "X"] }
            : t
        )
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "שגיאה בהרשמה");
    }
  };

  if (loading) return <p className="loading-text">טוען טיולים...</p>;

  return (
    <div className="trips-container">
      <h1>🌴 טיולי גלישה</h1>
      <p className="trips-intro">
        חוויית גלישה מושלמת מחוץ לשגרה – טיולי גלישה מאורגנים עם מדריכים
        מקצועיים, חופים נבחרים ולינה נוחה ליד הים.
      </p>

      {message && <p className="info-box">{message}</p>}

      <div className="trips-grid">
        {trips.map((trip) => {
          const spotsLeft = trip.maxParticipants - trip.participants.length;

          return (
            <div key={trip._id} className="trip-card">
              {trip.image && (
                <img src={trip.image} alt={trip.title} className="trip-image" />
              )}

              <div className="trip-info">
                <h3>{trip.title}</h3>

                <p>📍 {trip.location}</p>

                <p>
                  🗓 {new Date(trip.startDate).toLocaleDateString("he-IL")} –{" "}
                  {new Date(trip.endDate).toLocaleDateString("he-IL")}
                </p>

                <p>💸 {trip.price} ₪</p>

                {trip.description && <p>{trip.description}</p>}

                <p>
                  🧍‍♂ מקומות פנויים:{" "}
                  <strong style={{ color: spotsLeft === 0 ? "red" : "green" }}>
                    {spotsLeft === 0 ? "מלא" : spotsLeft}
                  </strong>
                </p>

                <button
                  className="register-btn"
                  disabled={spotsLeft === 0}
                  onClick={() => registerToTrip(trip._id)}
                >
                  {spotsLeft === 0 ? "הטיול מלא" : "להרשמה לטיול"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TripsPage;
