const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  userSource: {
    type: String,
    default: "SYSTEM",
  },
  action: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  resourceId: {
    type: String,
    default: "",
  },
  details: {
    type: String,
    default: "",
  },
  severity: {
    type: String,
    enum: ["info", "warning", "critical"],
    default: "info",
  },
  ipAddress: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
