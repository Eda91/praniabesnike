const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, code
      FROM directorates
      WHERE active = true
      ORDER BY name
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gabim gjatë marrjes së Drejtorive Vendore"
    });
  }
});

module.exports = router;