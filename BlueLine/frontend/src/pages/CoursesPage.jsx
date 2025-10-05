import "./CoursesPage.css";

const courses = [
  {
    id: 1,
    name: "קורס גלישה למתחילים",
    level: "מתחילים",
    price: "₪450",
    duration: "4 מפגשים / שעה וחצי כל מפגש",
    description: "לימוד עמידה על הגלשן, תזמון, בטיחות וכניסה נכונה למים.",
    image: "/images/r.jpg",
  },
  {
    id: 2,
    name: "קורס גלישה למתקדמים",
    level: "מתקדמים",
    price: "₪600",
    duration: "5 מפגשים / שעתיים כל מפגש",
    description: "שיפור טכניקת חיתוך, תמרונים, קריאה נכונה של הגלים.",
    image: "/images/surf-advanced.jpg",
  },
  {
    id: 3,
    name: "קורס גלישת סאפ",
    level: "כל הרמות",
    price: "₪300",
    duration: "מפגש חד פעמי / שעתיים",
    description: "היכרות עם גלשן סאפ, שיווי משקל, חתירה וגלישה ראשונית.",
    image: "/images/surf-sup.jpg",
  },
];

function CoursesPage() {
  return (
    <div className="courses-container">
      <h2>🎓 קורסים לגלישה</h2>
      <p className="intro">
        כאן תוכלו למצוא קורסים במגוון רמות, בהנחיית מדריכים מקצועיים – חוויה
        מהנה ובטוחה לכל גיל!
      </p>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <img
              src={course.image}
              alt={course.name}
              className="course-image"
            />
            <h3>{course.name}</h3>
            <p>
              <strong>רמה:</strong> {course.level}
            </p>
            <p>
              <strong>משך:</strong> {course.duration}
            </p>
            <p>
              <strong>מחיר:</strong> {course.price}
            </p>
            <p>{course.description}</p>
            <button className="enroll-btn">להרשמה</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
