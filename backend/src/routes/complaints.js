const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.complaint_code,
        c.received_date,

        d.name AS directorate_name,
        m.name AS municipality_name,
        co.name AS county_name,

        c.complainant_first_name,
        c.complainant_last_name,
        c.contact,

        cat.name AS category_name,

        s.name AS status_name,
        sg.name AS status_group,

        c.last_update_date,
        c.closed_date,

        CURRENT_DATE - c.received_date AS days_in_process,
        CURRENT_DATE - c.last_update_date AS days_without_update

      FROM complaints c

      JOIN directorates d
        ON d.id = c.directorate_id

      JOIN municipalities m
        ON m.id = c.municipality_id

      JOIN counties co
        ON co.id = m.county_id

      JOIN categories cat
        ON cat.id = c.category_id

      JOIN statuses s
        ON s.id = c.status_id

      JOIN status_groups sg
        ON sg.id = s.status_group_id

      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("GET complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Gabim gjatë marrjes së ankesave",
      error: error.message,
    });
  }
});

module.exports = router;