const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

// Protected route
router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Accès autorisé!",
    user: req.user,
  });
});

module.exports = router;
