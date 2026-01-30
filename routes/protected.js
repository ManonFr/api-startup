const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// Protected route to get the current user's profile
router.get("/profile", authenticateToken, getProfile);
router.patch("/profile", authenticateToken, updateProfile);

module.exports = router;
