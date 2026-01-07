import React, { useState } from "react";
import "./CourseRegistrationModal.css";

const CourseRegistrationModal = ({ course, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // נתונים שהמשתמש ממלא
  const [formData, setFormData] = useState({
    fullName: "",
    isOver18: false,
    knowsSwimming: "",
    healthDeclared: false,
    creditCard: "",
    cvv: "",
    expiry: "",
  });

  if (!course) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // בדיקת שלב 1: הצהרת בריאות וגיל
  const handleHealthSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName) return setError("נא למלא שם מלא");
    if (!formData.isOver18) return setError("חובה להיות מעל גיל 18");
    if (formData.knowsSwimming !== "yes")
      return setError("ידע בשחייה הוא חובה");
    if (!formData.healthDeclared) return setError("יש לאשר את הצהרת הבריאות");

    setError("");
    setStep(2); // מעבר לתשלום
  };

  // בדיקת שלב 2: תשלום וסיום
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!formData.creditCard || !formData.cvv || !formData.expiry) {
      return setError("נא למלא פרטי אשראי מלאים");
    }

    // הכל תקין - שולחים את המידע לדף האב (CoursesPage)
    onConfirm({
      healthData: {
        declared: true,
        swimming: true,
        ageVerified: true,
        timestamp: new Date(),
      },
      paymentData: {
        last4Digits: formData.creditCard.slice(-4),
        paid: true,
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2 className="modal-title">
          {step === 1 ? `הרשמה ל${course.name}` : "תשלום מאובטח"}
        </h2>

        {/* שלב 1 - בריאות וגיל */}
        {step === 1 && (
          <form onSubmit={handleHealthSubmit} className="modal-form">
            <label>שם מלא</label>
            <input
              type="text"
              name="fullName"
              onChange={handleChange}
              className="modal-input"
            />

            <div className="health-section">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="isOver18"
                  onChange={handleChange}
                />
                אני מאשר/ת שאני מעל גיל 18
              </label>

              <label>האם יש ידע בשחייה?</label>
              <select
                name="knowsSwimming"
                onChange={handleChange}
                className="modal-input"
              >
                <option value="">בחר...</option>
                <option value="yes">כן, יודע לשחות</option>
                <option value="no">לא</option>
              </select>

              <label className="checkbox-row red-text">
                <input
                  type="checkbox"
                  name="healthDeclared"
                  onChange={handleChange}
                />
                אני מצהיר שמצבי הבריאותי תקין לפעילות ימית.
              </label>
            </div>

            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="modal-btn">
              המשך לתשלום
            </button>
          </form>
        )}

        {/* שלב 2 - תשלום */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="modal-form">
            <div className="price-summary">
              לתשלום: <strong>₪{course.price}</strong>
            </div>

            <label>מספר אשראי</label>
            <input
              type="text"
              name="creditCard"
              placeholder="0000 0000 0000 0000"
              onChange={handleChange}
              className="modal-input"
            />

            <div className="row">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                onChange={handleChange}
                className="modal-input"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                onChange={handleChange}
                className="modal-input"
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <div className="btn-row">
              <button
                type="button"
                className="back-btn"
                onClick={() => setStep(1)}
              >
                חזרה
              </button>
              <button type="submit" className="modal-btn">
                שלם והירשם
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseRegistrationModal;
