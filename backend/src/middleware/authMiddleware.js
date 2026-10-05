const jwt = require("jsonwebtoken");

// =========================================================
// VERIFY JWT
// =========================================================

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Nuk jeni të autentikuar.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token i pavlefshëm ose i skaduar.",
    });
  }
}

// =========================================================
// ADMIN ONLY
// =========================================================

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Nuk jeni të autentikuar.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Nuk keni të drejtë për këtë veprim.",
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
};