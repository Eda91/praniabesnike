const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =========================================================
// GET /api/users
// Merr të gjithë përdoruesit
// Vetëm ADMIN
// =========================================================

router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          u.id,
          u.username,
          u.role,
          u.active,
          u.directorate_id,
          d.name AS directorate_name,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN directorates d
          ON d.id = u.directorate_id
        ORDER BY u.created_at DESC
      `);

      return res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("GET USERS ERROR:", error);

      return res.status(500).json({
        success: false,
        message:
          "Gabim gjatë marrjes së përdoruesve.",
        error: error.message,
      });
    }
  }
);


// =========================================================
// POST /api/users
// Krijo përdorues të ri
// Vetëm ADMIN
// =========================================================

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        username,
        password,
        role,
        directorate_id,
      } = req.body;

      // -----------------------------------------------------
      // VALIDIMI BAZË
      // -----------------------------------------------------

      if (!username || !username.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Username është i detyrueshëm.",
        });
      }

      if (!password) {
        return res.status(400).json({
          success: false,
          message:
            "Fjalëkalimi është i detyrueshëm.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Fjalëkalimi duhet të ketë të paktën 6 karaktere.",
        });
      }

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({
          success: false,
          message:
            "Roli duhet të jetë admin ose user.",
        });
      }

      // User normal duhet patjetër të ketë drejtori
      if (role === "user" && !directorate_id) {
        return res.status(400).json({
          success: false,
          message:
            "Drejtoria është e detyrueshme për përdoruesin.",
        });
      }

      // Admin nuk lidhet me drejtori
      const finalDirectorateId =
        role === "admin"
          ? null
          : Number(directorate_id);

      // -----------------------------------------------------
      // KONTROLLO USERNAME
      // -----------------------------------------------------

      const existingUsername =
        await pool.query(
          `
          SELECT id
          FROM users
          WHERE LOWER(username) = LOWER($1)
          LIMIT 1
          `,
          [username.trim()]
        );

      if (existingUsername.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "Ekziston një përdorues me këtë username.",
        });
      }

      // -----------------------------------------------------
      // KONTROLLO DREJTORINË
      // -----------------------------------------------------

      if (role === "user") {
        const directorate =
          await pool.query(
            `
            SELECT id
            FROM directorates
            WHERE id = $1
            LIMIT 1
            `,
            [finalDirectorateId]
          );

        if (directorate.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message:
              "Drejtoria e zgjedhur nuk ekziston.",
          });
        }

        /*
          Aktualisht users.directorate_id është UNIQUE,
          pra lejojmë vetëm një user për drejtori.
        */

        const existingDirectorateUser =
          await pool.query(
            `
            SELECT id, username
            FROM users
            WHERE directorate_id = $1
            LIMIT 1
            `,
            [finalDirectorateId]
          );

        if (
          existingDirectorateUser.rows.length > 0
        ) {
          return res.status(409).json({
            success: false,
            message:
              "Kjo drejtori ka tashmë një përdorues.",
          });
        }
      }

      // -----------------------------------------------------
      // HASH PASSWORD
      // -----------------------------------------------------

      const passwordHash =
        await bcrypt.hash(password, 10);

      // -----------------------------------------------------
      // INSERT USER
      // -----------------------------------------------------

      const result = await pool.query(
        `
        INSERT INTO users (
          username,
          password_hash,
          role,
          directorate_id,
          active
        )
        VALUES ($1, $2, $3, $4, true)

        RETURNING
          id,
          username,
          role,
          directorate_id,
          active,
          created_at,
          updated_at
        `,
        [
          username.trim(),
          passwordHash,
          role,
          finalDirectorateId,
        ]
      );

      const createdUser = result.rows[0];

      // Marrim emrin e drejtorisë për frontend
      let directorateName = null;

      if (createdUser.directorate_id) {
        const directorateResult =
          await pool.query(
            `
            SELECT name
            FROM directorates
            WHERE id = $1
            `,
            [createdUser.directorate_id]
          );

        directorateName =
          directorateResult.rows[0]?.name || null;
      }

      return res.status(201).json({
        success: true,
        message:
          "Përdoruesi u krijua me sukses.",
        data: {
          ...createdUser,
          directorate_name: directorateName,
        },
      });
    } catch (error) {
      console.error(
        "CREATE USER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Gabim gjatë krijimit të përdoruesit.",
        error: error.message,
      });
    }
  }
);


// =========================================================
// PUT /api/users/:id
// Ndrysho përdorues
// Vetëm ADMIN
// =========================================================

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);

      const {
        username,
        role,
        directorate_id,
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "ID e përdoruesit nuk është e vlefshme.",
        });
      }

      if (!username || !username.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Username është i detyrueshëm.",
        });
      }

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({
          success: false,
          message:
            "Roli nuk është i vlefshëm.",
        });
      }

      if (role === "user" && !directorate_id) {
        return res.status(400).json({
          success: false,
          message:
            "Drejtoria është e detyrueshme.",
        });
      }

      const finalDirectorateId =
        role === "admin"
          ? null
          : Number(directorate_id);

      // Username duhet të jetë unik
      const usernameCheck =
        await pool.query(
          `
          SELECT id
          FROM users
          WHERE LOWER(username) = LOWER($1)
            AND id <> $2
          LIMIT 1
          `,
          [
            username.trim(),
            userId,
          ]
        );

      if (usernameCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "Ekziston një përdorues me këtë username.",
        });
      }

      // Një user për drejtori
      if (role === "user") {
        const directorateCheck =
          await pool.query(
            `
            SELECT id
            FROM users
            WHERE directorate_id = $1
              AND id <> $2
            LIMIT 1
            `,
            [
              finalDirectorateId,
              userId,
            ]
          );

        if (
          directorateCheck.rows.length > 0
        ) {
          return res.status(409).json({
            success: false,
            message:
              "Kjo drejtori ka tashmë një përdorues.",
          });
        }
      }

      const result = await pool.query(
        `
        UPDATE users
        SET
          username = $1,
          role = $2,
          directorate_id = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4

        RETURNING
          id,
          username,
          role,
          directorate_id,
          active,
          created_at,
          updated_at
        `,
        [
          username.trim(),
          role,
          finalDirectorateId,
          userId,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Përdoruesi nuk u gjet.",
        });
      }

      return res.json({
        success: true,
        message:
          "Përdoruesi u përditësua me sukses.",
        data: result.rows[0],
      });
    } catch (error) {
      console.error(
        "UPDATE USER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Gabim gjatë përditësimit të përdoruesit.",
        error: error.message,
      });
    }
  }
);


// =========================================================
// PATCH /api/users/:id/status
// Aktivizo / çaktivizo përdorues
// Vetëm ADMIN
// =========================================================

router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { active } = req.body;

      if (typeof active !== "boolean") {
        return res.status(400).json({
          success: false,
          message:
            "Statusi active duhet të jetë true ose false.",
        });
      }

      // Admini nuk duhet të çaktivizojë veten
      if (
        userId === Number(req.user.id) &&
        active === false
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Nuk mund të çaktivizoni llogarinë tuaj.",
        });
      }

      const result = await pool.query(
        `
        UPDATE users
        SET
          active = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2

        RETURNING
          id,
          username,
          role,
          directorate_id,
          active,
          updated_at
        `,
        [
          active,
          userId,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Përdoruesi nuk u gjet.",
        });
      }

      return res.json({
        success: true,
        message: active
          ? "Përdoruesi u aktivizua."
          : "Përdoruesi u çaktivizua.",
        data: result.rows[0],
      });
    } catch (error) {
      console.error(
        "UPDATE USER STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Gabim gjatë ndryshimit të statusit.",
        error: error.message,
      });
    }
  }
);


module.exports = router;