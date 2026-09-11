const mongoose = require("mongoose");

const groundStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Station name is required"],
      trim: true,
    },
    stationId: {
      type: String,
      required: [true, "Station ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "degraded", "offline", "maintenance"],
      default: "active",
    },
    connectedSatellites: [
      {
        type: String, // satelliteId strings
      },
    ],
    signalQuality: {
      type: Number,
      default: 98,
      min: 0,
      max: 100,
    },
    lastContact: {
      type: Date,
      default: Date.now,
    },
    nextContact: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroundStation", groundStationSchema);
