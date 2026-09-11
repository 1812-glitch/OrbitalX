const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
  satelliteId: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  temperature: { type: Number, default: 22 },
  speed: { type: Number, default: 7.66 },
  altitude: { type: Number, default: 408 },
  distanceFromEarth: { type: Number, default: 408 },
  battery: { type: Number, default: 94 },
  signal: { type: Number, default: -42 },
  connectivity: {
    type: String,
    enum: ["connected", "intermittent", "lost"],
    default: "connected",
  },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  health: { type: Number, default: 98 },
  cpu: { type: Number, default: 15 },
  memory: { type: Number, default: 30 },
  pitch: { type: Number, default: 0 },
  roll: { type: Number, default: 0 },
  yaw: { type: Number, default: 0 },
  solarArrayPower: { type: Number, default: 12.4 },
  dataBuffer: { type: Number, default: 22 },
});

// Compound index for efficient time-series queries
telemetrySchema.index({ satelliteId: 1, timestamp: -1 });

module.exports = mongoose.model("Telemetry", telemetrySchema);
