const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check if username exists
    const userCheck = await pool.query("SELECT * FROM Players WHERE name = $1", [name]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default player values
    const defaultPlayer = {
      level: 1,
      money: 0,
      mesh: "default_mesh",
      material: "default_material",
      pistol: null,
      rifle: null,
      shotgun: null,
    };

    // Insert new player
    const newPlayer = await pool.query(
      `INSERT INTO Players (name, password, level, money, mesh, material, pistol, rifle, shotgun)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, level, money, mesh, material`,
      [name, hashedPassword, defaultPlayer.level, defaultPlayer.money, defaultPlayer.mesh, defaultPlayer.material, defaultPlayer.pistol, defaultPlayer.rifle, defaultPlayer.shotgun]
    );

    res.json({ message: "Registration successful", player: newPlayer.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const player = await pool.query("SELECT * FROM Players WHERE name = $1", [name]);

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
