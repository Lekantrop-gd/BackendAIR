const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all pistols
router.get("/pistols", async (req, res) => {
  try {
    const pistols = await pool.query("SELECT * FROM Pistol");
    res.json(pistols.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load pistols" });
  }
});

// GET all rifles
router.get("/rifles", async (req, res) => {
  try {
    const rifles = await pool.query("SELECT * FROM Rifle");
    res.json(rifles.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load rifles" });
  }
});

// GET all shotguns
router.get("/shotguns", async (req, res) => {
  try {
    const shotguns = await pool.query("SELECT * FROM Shotgun");
    res.json(shotguns.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load shotguns" });
  }
});

// GET all knives
router.get("/knives", async (req, res) => {
  try {
    const knives = await pool.query("SELECT * FROM Knife");
    res.json(knives.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load knives" });
  }
});

module.exports = router;
