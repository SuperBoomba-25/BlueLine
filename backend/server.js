const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const connectDB = require("./config/db");

// ייבוא הנתיבים
const blogRoutes = require("./routes/blogRoutes");
const courseRoutes = require("./routes/courseRoutes");
const tripRoutes = require("./routes/tripRoutes");
const authRoutes = require("./routes/auth"); // וודא שהקובץ נקרא auth.js

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://blueline-yyzo.onrender.com",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const io = new Server(server, { cors: corsOptions });

app.set("trust proxy", 1);
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan("combined"));

// --- הגנה מפני קריסה (Debugging) ---

// 1. בלוג
if (typeof blogRoutes === "function") {
  app.use("/api/blog", blogRoutes);
} else {
  console.error("❌ ERROR: blogRoutes file is invalid or empty.");
}

// 2. טיולים
if (typeof tripRoutes === "function") {
  app.use("/api/trips", tripRoutes);
} else {
  console.error("❌ ERROR: tripRoutes file is invalid or empty.");
}

// 3. קורסים
if (typeof courseRoutes === "function") {
  app.use("/api/courses", courseRoutes);
} else {
  console.error("❌ ERROR: courseRoutes file is invalid or empty.");
}

// 4. אימות (Auth) - כאן הייתה הבעיה בשורה 60
if (typeof authRoutes === "function") {
  app.use("/api/auth", authRoutes);
} else {
  console.error(
    "❌ CRITICAL ERROR: authRoutes file is invalid! Check backend/routes/auth.js"
  );
  // אנחנו לא מפעילים את ה-use הזה כדי לא להפיל את השרת
}

// ------------------------------------

app.get("/", (req, res) => res.send("🌊 BlueLine API is running..."));

io.on("connection", (socket) => {
  console.log("🔗 משתמש התחבר");
  socket.on("disconnect", () => console.log("❌ משתמש התנתק"));
  socket.on("newMessage", (data) => io.emit("newMessage", data));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
