const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered.");
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "viewer", // Default role for new registrations
  });

  // Generate token
  const token = generateToken(user._id);

  // Audit log
  await AuditLog.create({
    userId: user._id,
    userSource: user.email,
    action: "USER_REGISTER",
    resource: "User",
    resourceId: user._id.toString(),
    details: `New user registered: ${user.email}`,
    severity: "info",
  });

  res.status(201).json(new ApiResponse(201, "Account created successfully.", {
    token,
    user,
  }));
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include passwordHash for comparison
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated. Contact administrator.");
  }

  // Compare password
  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Audit log
  await AuditLog.create({
    userId: user._id,
    userSource: user.email,
    action: "USER_LOGIN",
    resource: "User",
    resourceId: user._id.toString(),
    details: `User logged in: ${user.email}`,
    severity: "info",
    ipAddress: req.ip || "",
  });

  res.json(new ApiResponse(200, "Login successful.", {
    token,
    user,
  }));
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, "User profile retrieved.", { user: req.user }));
});

// PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, callsign } = req.body;
  const user = req.user;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (callsign !== undefined) user.callsign = callsign;

  await user.save();

  res.json(new ApiResponse(200, "Profile updated.", { user }));
});

// PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with passwordHash
  const user = await User.findById(req.user._id).select("+passwordHash");

  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  res.json(new ApiResponse(200, "Password changed successfully."));
});

module.exports = { register, login, getMe, updateProfile, changePassword };
