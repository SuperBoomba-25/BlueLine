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

// ✅ בחר באחת מהאפשרויות לחיבור
// 1. שימוש ב-config/db.js
const connectDB = require("./config/db");

// 2. או שימוש ב-db/mongo.js
// const { connectToDB } = require("./db/mongo");

const courseRoutes = require("./routes/courseRoutes");
const tripRoutes = require("./routes/tripRoutes");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const surfRoutes = require("./routes/surf");
const forumRoutes = require("./routes/forumRoutes");

// 🟢 Load environment variables

// 🟢 Connect to MongoDB
connectDB(); // או connectToDB();

const app = express();
const server = http.createServer(app);

// 💡 CORS
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

// 🟢 Middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan("combined"));
// 🟢 Routes
app.use("/api/trips", tripRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/surf", surfRoutes);
app.use("/api/forums", forumRoutes);

// 🟢 Base route
app.get("/", (req, res) => res.send("🌊 BlueLine API is running..."));

// 🟢 WebSocket
io.on("connection", (socket) => {
  console.log("🔗 משתמש התחבר");
  socket.on("disconnect", () => console.log("❌ משתמש התנתק"));
  socket.on("newMessage", (data) => io.emit("newMessage", data));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
