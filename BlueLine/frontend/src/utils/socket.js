// src/utils/socket.js
import { io } from "socket.io-client";

// הכתובת של השרת שלך (אם הוא רץ בלוקאל, זה localhost:5000)
const SOCKET_URL = "http://localhost:5000";

// יצירת חיבור יחיד לשרת ה־WebSocket
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // חיבור יציב יותר
  reconnectionAttempts: 5, // נסיונות חיבור מחדש
  reconnectionDelay: 2000, // המתנה בין נסיונות
});

socket.on("connect", () => {
  console.log("✅ מחובר לשרת WebSocket");
});

socket.on("disconnect", () => {
  console.log("❌ נותק מהשרת WebSocket");
});

export default socket;
