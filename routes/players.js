const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all players
router.get("/", async (req, res) => {
  try {
    const players = await pool.query("SELECT * FROM Players");
    res.json(players.rows);
  } catch (err) {
    res.status(500).send("Error");
  }
});

// Add a new player
router.post("/", async (req, res) => {
  const { name, score } = req.body;
  try {
    const newPlayer = await pool.query(
      "INSERT INTO Players (name, score) VALUES ($1, $2) RETURNING *",
      [name, score]
    );
    res.json(newPlayer.rows[0]);
  } catch (err) {
    res.status(500).send("Insert error");
  }
});

module.exports = router;
