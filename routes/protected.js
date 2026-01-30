const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const { getHistory } = require("../controllers/historyController");

router.use(authenticateToken);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.get("/history", getHistory);
module.exports = router;
