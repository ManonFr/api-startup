const jwt = require("jsonwebtoken");

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Expected format: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user data to the request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré." });
  }
}

module.exports = authenticateToken;
