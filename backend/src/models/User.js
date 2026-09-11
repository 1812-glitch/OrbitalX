const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["viewer", "operator", "admin"],
      default: "viewer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    callsign: {
      type: String,
      trim: true,
      default: "",
    },
    clearanceLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    station: {
      type: String,
      default: "Ground Control 01",
    },
    phone: {
      type: String,
      default: "",
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Don't return passwordHash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
