const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { hashPassword } = require("../utils/password");
const { getPagination, paginateResponse } = require("../utils/pagination");

// GET /api/users — list all users (admin)
const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, "Users retrieved.", paginateResponse(users, total, page, limit)));
});

// GET /api/users/:id — get single user (admin)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found.");
  res.json(new ApiResponse(200, "User retrieved.", { user }));
});

// PUT /api/users/:id — update user role/status (admin)
const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive, clearanceLevel, station } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found.");

  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (clearanceLevel) user.clearanceLevel = clearanceLevel;
  if (station) user.station = station;

  await user.save();
  res.json(new ApiResponse(200, "User updated.", { user }));
});

// DELETE /api/users/:id — delete user (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found.");

  // Prevent self-deletion
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Cannot delete your own account.");
  }

  await user.deleteOne();
  res.json(new ApiResponse(200, "User deleted."));
});

module.exports = { getUsers, getUser, updateUser, deleteUser };
