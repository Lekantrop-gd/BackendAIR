const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");

// LOGIN
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const player = await pool.query("SELECT * FROM Admins WHERE name = $1", [name]);

    if (player.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, player.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Exclude password from the response
    const { password: _, ...playerData } = player.rows[0];
    res.json({ message: "Login successful", player: playerData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
});

module.exports = router;