const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectDB = require("./config/db");

// טעינת משתני סביבה (אבטחה)
dotenv.config();

// התחברות ל־MongoDB (סעיף 4.2.2)
connectDB();

const app = express();
app.set("trust proxy", 1);

app.use(express.json()); // כולל body-parser מובנה
app.use(cors());
app.use(helmet());

app.use(mongoSanitize()); // מניעת injections
app.use(xss()); // מניעת XSS

//  הגבלת בקשות
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 100, // מקסימום בקשות ל־IP
  message: "יותר מדי בקשות מה-IP הזה, נסה שוב מאוחר יותר.",
});
app.use(limiter);

// 📌 לוגים
app.use(morgan("combined"));

// 📌 Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

// Authentication (Login/Register, סעיפים 4.3.1-4.3.2)
app.use("/api", authRoutes);

// Users CRUD (פרופילים, ניהול, סעיפים 4.3.3-4.3.4)
app.use("/api/users", userRoutes);

app.use("/api/surf", require("./routes/surf"));

// בדיקה שהשרת רץ
app.get("/", (req, res) => res.send("🌊 BlueLine API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
