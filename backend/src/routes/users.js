const express = require("express");
const { getUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// All routes require auth + admin role
router.use(requireAuth, requireRole("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
