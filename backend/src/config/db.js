const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error("Server will start without database connection.");
    console.error("Please ensure MongoDB is running or update MONGODB_URI in .env");
  }
};

module.exports = connectDB;
