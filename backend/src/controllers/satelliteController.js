const Satellite = require("../models/Satellite");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { getPagination, paginateResponse } = require("../utils/pagination");

// GET /api/satellites
const getSatellites = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.orbitType) filter.orbitType = req.query.orbitType;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { satelliteId: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const [satellites, total] = await Promise.all([
    Satellite.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Satellite.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(200, "Satellites retrieved.", paginateResponse(satellites, total, page, limit))
  );
});

// GET /api/satellites/stats
const getSatelliteStats = asyncHandler(async (req, res) => {
  const [total, active, maintenance, inactive] = await Promise.all([
    Satellite.countDocuments(),
    Satellite.countDocuments({ status: "active" }),
    Satellite.countDocuments({ status: "maintenance" }),
    Satellite.countDocuments({ status: "inactive" }),
  ]);

  const connected = await Satellite.countDocuments({
    "currentTelemetry.connectivity": "connected",
  });

  const warning = await Satellite.countDocuments({
    $or: [
      { "currentTelemetry.health": { $lt: 80, $gte: 50 } },
      { status: "maintenance" },
    ],
  });

  const critical = await Satellite.countDocuments({
    $or: [
      { "currentTelemetry.health": { $lt: 50 } },
      { status: "inactive" },
    ],
  });

  res.json(
    new ApiResponse(200, "Satellite stats retrieved.", {
      total,
      active,
      connected,
      maintenance,
      inactive,
      warning,
      critical,
    })
  );
});

// GET /api/satellites/:id
const getSatellite = asyncHandler(async (req, res) => {
  const satellite = await Satellite.findById(req.params.id).populate("connectedGroundStation");
  if (!satellite) throw new ApiError(404, "Satellite not found.");
  res.json(new ApiResponse(200, "Satellite retrieved.", { satellite }));
});

// POST /api/satellites (admin/operator)
const createSatellite = asyncHandler(async (req, res) => {
  const satellite = await Satellite.create(req.body);
  res.status(201).json(new ApiResponse(201, "Satellite created.", { satellite }));
});

// PUT /api/satellites/:id (admin/operator)
const updateSatellite = asyncHandler(async (req, res) => {
  const satellite = await Satellite.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!satellite) throw new ApiError(404, "Satellite not found.");
  res.json(new ApiResponse(200, "Satellite updated.", { satellite }));
});

// DELETE /api/satellites/:id (admin)
const deleteSatellite = asyncHandler(async (req, res) => {
  const satellite = await Satellite.findByIdAndDelete(req.params.id);
  if (!satellite) throw new ApiError(404, "Satellite not found.");
  res.json(new ApiResponse(200, "Satellite deleted."));
});

module.exports = {
  getSatellites,
  getSatelliteStats,
  getSatellite,
  createSatellite,
  updateSatellite,
  deleteSatellite,
};
