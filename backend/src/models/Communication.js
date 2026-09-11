const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema(
  {
    satelliteId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    direction: {
      type: String,
      enum: ["uplink", "downlink"],
      required: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    type: {
      type: String,
      enum: ["command", "response", "system", "data"],
      default: "command",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "failed"],
      default: "sent",
    },
    latency: {
      type: Number,
      default: null, // ms
    },
  },
  { timestamps: true }
);

communicationSchema.index({ satelliteId: 1, createdAt: -1 });

module.exports = mongoose.model("Communication", communicationSchema);
