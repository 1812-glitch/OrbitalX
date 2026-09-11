const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    satelliteId: {
      type: String,
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metric: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
      default: null,
    },
    threshold: {
      type: Number,
      default: null,
    },
    subsystem: {
      type: String,
      default: "",
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

alertSchema.index({ satelliteId: 1, createdAt: -1 });
alertSchema.index({ severity: 1, resolved: 1 });

module.exports = mongoose.model("Alert", alertSchema);
