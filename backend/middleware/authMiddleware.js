const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// שיניתי את השם ל-protect כדי שיהיה תואם למה שכתוב ב-Routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // פענוח הטוקן
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // הערה: וודא שככה אתה יוצר את הטוקן ב-Login (עם user.id או סתם id)
      // אם ב-Login עשית jwt.sign({ id: user._id }), אז צריך decoded.id
      // אם עשית jwt.sign({ user: { id: user._id } }), אז decoded.user.id זה נכון.
      // אני משאיר את זה כמו שכתבת, אבל שים לב לזה:
      const userId = decoded.user ? decoded.user.id : decoded.id;

      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      return next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Token is invalid" });
    }
  }

  return res.status(401).json({ message: "No token, access denied" });
};

// 👇 התיקון הקריטי: ייצוא בתוך סוגריים מסולסלים
module.exports = { protect };
