const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const { getProfile } = require("../controllers/profileController");

// Protected route to get the current user's profile
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
