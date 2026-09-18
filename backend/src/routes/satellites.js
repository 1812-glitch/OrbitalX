const express = require("express");
const {
  getSatellites,
  getSatelliteStats,
  getSatellite,
  createSatellite,
  updateSatellite,
  deleteSatellite,
} = require("../controllers/satelliteController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get("/", getSatellites);
router.get("/stats", getSatelliteStats);
router.get("/:id", getSatellite);
router.post("/", requireRole("admin", "operator"), createSatellite);
router.put("/:id", requireRole("admin", "operator"), updateSatellite);
router.delete("/:id", requireRole("admin"), deleteSatellite);

module.exports = router;
