const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema(
  {
    satelliteId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: [true, "Command type is required"],
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["sent", "processing", "acknowledged", "failed", "timeout"],
      default: "sent",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    response: {
      type: String,
      default: "",
    },
    latency: {
      type: Number,
      default: null, // ms
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Command", commandSchema);
