require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createServer } = require("http");

const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const httpServer = createServer(app);

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// --------------- Health Check ---------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "OrbitalX API is running",
    timestamp: new Date().toISOString(),
  });
});

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`\n🛰️  OrbitalX Backend running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
