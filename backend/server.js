const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");

const directoratesRoutes = require("./src/routes/directorates");
const lookupsRoutes = require("./src/routes/lookups");
const complaintsRoutes = require("./src/routes/complaints");
const authRoutes = require("./src/routes/auth");
const usersRoutes = require("./src/routes/users");

const app = express();

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// ROUTES
// =========================================================

app.use("/api/directorates", directoratesRoutes);
app.use("/api/lookups", lookupsRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Prania Besnike API is running",
  });
});

// =========================================================
// DATABASE TEST
// =========================================================

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database,
        NOW() AS time
    `);

    res.json({
      success: true,
      database: result.rows[0].database,
      time: result.rows[0].time,
    });
  } catch (error) {
    console.error("Database test error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// =========================================================
// 404
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =========================================================
// SERVER
// =========================================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Prania Besnike API running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});