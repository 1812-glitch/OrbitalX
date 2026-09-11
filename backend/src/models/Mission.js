const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mission name is required"],
      trim: true,
    },
    missionId: {
      type: String,
      required: [true, "Mission ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "aborted", "archived"],
      default: "planning",
    },
    launchDate: {
      type: Date,
      default: null,
    },
    launchSite: {
      type: String,
      default: "",
    },
    objective: {
      type: String,
      default: "",
    },
    assignedSatellites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Satellite",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", missionSchema);
