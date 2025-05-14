const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all weapons (from all 3 tables)
router.get("/", async (req, res) => {
  try {
    const pistols = await pool.query("SELECT * FROM Pistol");
    const rifles = await pool.query("SELECT * FROM Rifle");
    const shotguns = await pool.query("SELECT * FROM Shotgun");

    res.json({
      pistols: pistols.rows,
      rifles: rifles.rows,
      shotguns: shotguns.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
