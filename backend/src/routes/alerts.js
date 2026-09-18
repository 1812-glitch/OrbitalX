const express = require("express");
const { getAlerts, acknowledgeAlert, resolveAlert } = require("../controllers/alertController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getAlerts);
router.put("/:id/acknowledge", requireRole("admin", "operator"), acknowledgeAlert);
router.put("/:id/resolve", requireRole("admin", "operator"), resolveAlert);

module.exports = router;
