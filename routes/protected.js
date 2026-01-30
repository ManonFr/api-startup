const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const {
  getHistory,
  createRevenueEntry,
} = require("../controllers/revenueController");

router.use(authenticateToken);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

router.get("/revenue", getHistory);
router.post("/revenue", createRevenueEntry);

module.exports = router;
