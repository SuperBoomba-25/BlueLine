import React, { useState } from "react";
import "./Modal.css"; // נשתמש באותו עיצוב של המודלים האחרים

function TripRegistrationModal({ trip, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [healthData, setHealthData] = useState({
    declared: false,
    swimming: false,
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleConfirm = () => {
    // כאן אפשר להוסיף ולידציה
    if (step === 2 && (!paymentData.cardNumber || !paymentData.cvv)) {
      alert("נא למלא פרטי אשראי (דמו)");
      return;
    }

    // שליחת הנתונים לאבא (הדף הראשי)
    onConfirm({
      healthData,
      paymentData: {
        last4Digits: paymentData.cardNumber.slice(-4) || "0000",
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <h3>📝 הרשמה לטיול: {trip.destination}</h3>

        {step === 1 && (
          <div className="modal-step">
            <h4>שלב 1: הצהרת בריאות</h4>
            <div style={{ marginBottom: "15px", textAlign: "right" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={healthData.declared}
                  onChange={(e) =>
                    setHealthData({ ...healthData, declared: e.target.checked })
                  }
                />
                אני מצהיר/ה שמצבי הבריאותי תקין ומאפשר השתתפות בטיול.
              </label>
              <label style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={healthData.swimming}
                  onChange={(e) =>
                    setHealthData({ ...healthData, swimming: e.target.checked })
                  }
                />
                אני יודע/ת לשחות (חובה בפעילויות ימיות).
              </label>
            </div>
            <div className="modal-buttons">
              <button
                onClick={() => setStep(2)}
                disabled={!healthData.declared}
                style={{ backgroundColor: "#007bff", color: "white" }}
              >
                המשך לתשלום ➡️
              </button>
              <button onClick={onClose} className="cancel-btn">
                ביטול
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="modal-step">
            <h4>שלב 2: תשלום ({trip.price} ₪)</h4>
            <div
              className="payment-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="מספר אשראי"
                value={paymentData.cardNumber}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cardNumber: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="תוקף (MM/YY)"
                  value={paymentData.expiry}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, expiry: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={paymentData.cvv}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, cvv: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "10px" }}>
              * זהו טופס דמו, לא מתבצע חיוב אמיתי.
            </p>

            <div className="modal-buttons" style={{ marginTop: "20px" }}>
              <button
                onClick={handleConfirm}
                style={{ backgroundColor: "#28a745", color: "white" }}
              >
                ✅ אשר הרשמה
              </button>
              <button onClick={() => setStep(1)} className="cancel-btn">
                חזרה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripRegistrationModal;
