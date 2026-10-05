const express = require("express");
const router = express.Router();
const pool = require("../config/db");

async function getTable(req, res, query) {
  try {
    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gabim gjatë marrjes së të dhënave",
    });
  }
}

// Drejtoritë Vendore
router.get("/directorates", (req, res) => {
  getTable(
    req,
    res,
    `SELECT id, name, code
     FROM directorates
     WHERE active = true
     ORDER BY name`
  );
});

// Qarqet
router.get("/counties", (req, res) => {
  getTable(
    req,
    res,
    `SELECT id, name
     FROM counties
     WHERE active = true
     ORDER BY name`
  );
});

// Bashkitë
router.get("/municipalities", (req, res) => {
  getTable(
    req,
    res,
    `SELECT
        m.id,
        m.name,
        m.directorate_id,
        m.county_id,
        d.name AS directorate_name,
        c.name AS county_name
     FROM municipalities m
     JOIN directorates d ON d.id = m.directorate_id
     JOIN counties c ON c.id = m.county_id
     WHERE m.active = true
     ORDER BY d.name, m.name`
  );
});

// Bashkitë vetëm të një DV-je
router.get("/municipalities/directorate/:directorateId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          m.id,
          m.name,
          m.county_id,
          c.name AS county_name
       FROM municipalities m
       JOIN counties c ON c.id = m.county_id
       WHERE m.directorate_id = $1
         AND m.active = true
       ORDER BY m.name`,
      [req.params.directorateId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gabim gjatë marrjes së bashkive",
    });
  }
});

// Deputetët
router.get("/deputies", (req, res) => {
  getTable(
    req,
    res,
    `SELECT id, name
     FROM deputies
     WHERE active = true
     ORDER BY name`
  );
});

// Kategoritë
router.get("/categories", (req, res) => {
  getTable(
    req,
    res,
    `SELECT id, name
     FROM categories
     WHERE active = true
     ORDER BY name`
  );
});

// Statuset + grupi
router.get("/statuses", (req, res) => {
  getTable(
    req,
    res,
    `SELECT
        s.id,
        s.name,
        s.status_group_id,
        sg.name AS group_name
     FROM statuses s
     JOIN status_groups sg ON sg.id = s.status_group_id
     WHERE s.active = true
     ORDER BY sg.id, s.id`
  );
});

// Pengesat
router.get("/obstacles", (req, res) => {
  getTable(
    req,
    res,
    `SELECT id, name
     FROM obstacles
     WHERE active = true
     ORDER BY name`
  );
});

// Sektorët
router.get("/sectors", (req, res) => {
  getTable(
    req,
    res,
    `SELECT id, name
     FROM sectors
     WHERE active = true
     ORDER BY name`
  );
});

// Mënyrat e njoftimit
router.get("/notification-types", (req, res) => {
  getTable(
    req,
    res,
    `SELECT id, name
     FROM notification_types
     WHERE active = true
     ORDER BY name`
  );
});

// Parametrat e sistemit
router.get("/parameters", (req, res) => {
  getTable(
    req,
    res,
    `SELECT key, value
     FROM system_parameters
     ORDER BY key`
  );
});

module.exports = router;