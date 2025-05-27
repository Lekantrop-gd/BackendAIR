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

// POST pistols
router.post("/pistols", async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    await client.query("BEGIN");

    // Optional: Clear the table before inserting if needed
    await client.query("DELETE FROM Pistol");

    for (const pistol of items) {
      const {
        id,
        level,
        power,
        accuracy,
        reloadspeed,
        firerate,
        magazine,
        price,
      } = pistol;

      await client.query(
        `INSERT INTO Pistol (id, level, power, accuracy, reloadspeed, firerate, magazine, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, level, power, accuracy, reloadspeed, firerate, magazine, price]
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Pistols saved successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to save pistols" });
  } finally {
    client.release();
  }
});


module.exports = router;
