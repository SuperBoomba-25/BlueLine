import React from "react";
import "./TripsPage.css";

const trips = [
  {
    id: 1,
    title: "טיול גלישה בסרי לנקה",
    location: "סרי לנקה",
    date: "10–20 בנובמבר 2025",
    price: "₪4,500",
    description:
      "טיול גלישה חווייתי בסרי לנקה הכולל לינה, הדרכה מקצועית, טיולים בטבע וגלישה באחד החופים הטובים בעולם.",
    image: "/images/sri-lanka.jpg",
  },
  {
    id: 2,
    title: "חופשת גלישה במרוקו",
    location: "תגזhout, מרוקו",
    date: "5–12 בדצמבר 2025",
    price: "₪3,900",
    description:
      "הצטרפו לטיול למרוקו עם שיעורי גלישה יומיים, טיולים במדבר ובשווקים המקומיים, ואווירה מדהימה של גולשים מכל העולם.",
    image: "/images/morocco.jpg",
  },
  {
    id: 3,
    title: "קורס גלישה מתקדם בפורטוגל",
    location: "אריסיירה, פורטוגל",
    date: "15–22 בינואר 2026",
    price: "₪4,200",
    description:
      "קורס גלישה מתקדם בקבוצה קטנה עם מאמן אישי, מתאים לגולשים שרוצים להשתפר ברמה הטכנית באחד מאתרי הגלישה המובילים באירופה.",
    image: "/images/portugal.jpg",
  },
];

function TripsPage() {
  return (
    <div className="trips-container">
      <h1>🌴 טיולי גלישה</h1>
      <p>גלו את היעדים החמים בעולם והצטרפו לחוויות גלישה בלתי נשכחות!</p>
      <div className="trips-grid">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <img src={trip.image} alt={trip.title} className="trip-image" />
            <div className="trip-info">
              <h3>{trip.title}</h3>
              <p>📍 {trip.location}</p>
              <p>🗓 {trip.date}</p>
              <p>💸 {trip.price}</p>
              <p>{trip.description}</p>
              <button className="register-btn">להרשמה</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripsPage;
