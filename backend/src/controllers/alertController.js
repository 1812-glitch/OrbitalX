const Alert = require("../models/Alert");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { getPagination, paginateResponse } = require("../utils/pagination");

// GET /api/alerts
const getAlerts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.severity) filter.severity = req.query.severity;
  if (req.query.satelliteId) filter.satelliteId = req.query.satelliteId;
  if (req.query.resolved === "true") filter.resolved = true;
  if (req.query.resolved === "false") filter.resolved = false;

  const [alerts, total] = await Promise.all([
    Alert.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Alert.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, "Alerts retrieved.", paginateResponse(alerts, total, page, limit)));
});

// PUT /api/alerts/:id/acknowledge
const acknowledgeAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) throw new ApiError(404, "Alert not found.");

  alert.acknowledged = true;
  alert.acknowledgedBy = req.user._id;
  alert.acknowledgedAt = new Date();
  await alert.save();

  res.json(new ApiResponse(200, "Alert acknowledged.", { alert }));
});

// PUT /api/alerts/:id/resolve
const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) throw new ApiError(404, "Alert not found.");

  alert.resolved = true;
  alert.resolvedAt = new Date();
  await alert.save();

  res.json(new ApiResponse(200, "Alert resolved.", { alert }));
});

// GET /api/alerts/stats — aggregate unresolved alert counts
const getAlertStats = asyncHandler(async (req, res) => {
  const [total, critical, warning, info] = await Promise.all([
    Alert.countDocuments({ resolved: false }),
    Alert.countDocuments({ resolved: false, severity: "critical" }),
    Alert.countDocuments({ resolved: false, severity: "warning" }),
    Alert.countDocuments({ resolved: false, severity: "info" }),
  ]);

  res.json(
    new ApiResponse(200, "Alert stats retrieved.", {
      total,
      critical,
      warning,
      info,
    })
  );
});

module.exports = { getAlerts, getAlertStats, acknowledgeAlert, resolveAlert };
