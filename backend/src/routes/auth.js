const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// =========================================================
// LOGIN
// POST /api/auth/login
// =========================================================

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kontrollojmë inputet
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dhe fjalëkalimi janë të detyrueshëm.",
      });
    }

    // Gjejmë user-in
    const result = await pool.query(
      `
      SELECT
        id,
        directorate_id,
        username,
        password_hash,
        role,
        active
      FROM users
      WHERE LOWER(username) = LOWER($1)
      LIMIT 1
      `,
      [username.trim()]
    );

    // User nuk ekziston
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username ose fjalëkalim i pasaktë.",
      });
    }

    const user = result.rows[0];

    // User është çaktivizuar
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: "Kjo llogari është çaktivizuar.",
      });
    }

    // Kontrollojmë password-in
    const passwordIsValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Username ose fjalëkalim i pasaktë.",
      });
    }

    // Krijojmë JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        directorate_id: user.directorate_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      }
    );

    return res.json({
      success: true,
      message: "Login u krye me sukses.",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        directorate_id: user.directorate_id,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gabim gjatë autentikimit.",
      error: error.message,
    });
  }
});

module.exports = router;