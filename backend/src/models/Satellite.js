const mongoose = require("mongoose");

const satelliteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Satellite name is required"],
      trim: true,
    },
    satelliteId: {
      type: String,
      required: [true, "Satellite ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    noradId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "standby", "maintenance", "offline", "decommissioned"],
      default: "active",
    },
    orbitType: {
      type: String,
      enum: ["LEO", "MEO", "GEO", "SSO", "Polar", "Graveyard"],
      default: "LEO",
    },
    // Orbit parameters for simulation
    orbitRadius: {
      type: Number,
      default: 6771, // km from Earth center (LEO ~400km altitude)
    },
    orbitSpeed: {
      type: Number,
      default: 0.001, // radians per tick
    },
    inclination: {
      type: Number,
      default: 51.6, // degrees
    },
    currentAngle: {
      type: Number,
      default: 0, // current orbital angle in radians
    },
    // Current telemetry snapshot (updated by simulation)
    currentTelemetry: {
      temperature: { type: Number, default: 22 },
      speed: { type: Number, default: 7.66 },
      altitude: { type: Number, default: 408 },
      distanceFromEarth: { type: Number, default: 408 },
      battery: { type: Number, default: 94 },
      signal: { type: Number, default: -42 },
      connectivity: { type: String, default: "connected" },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      health: { type: Number, default: 98 },
    },
    // Satellite class/type
    satelliteClass: {
      type: String,
      default: "6U CubeSat",
    },
    launchDate: {
      type: Date,
      default: null,
    },
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },
    connectedGroundStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroundStation",
      default: null,
    },
  },
  { timestamps: true }
);

satelliteSchema.index({ status: 1 });

module.exports = mongoose.model("Satellite", satelliteSchema);
