// backend/db/mongo.js
const mongoose = require("mongoose");

let dbConnection = null; // נשמר החיבור במסד

const connectToDB = async () => {
  try {
    if (!dbConnection) {
      dbConnection = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB connected");
    }
    return dbConnection;
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

const getDB = () => dbConnection;

module.exports = { connectToDB, getDB };
