const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");

// REGISTER
router.post("/register", async (req, res) => {
  console.log("Incoming req.body:", req.body); // Add this line
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
      money: 100,
      mesh: "CyberPunk",
      material: "01_A",
      pistol: 1,
      rifle: 1,
      shotgun: 1,
      knife: 1
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

// Update mesh and material
router.put("/updateAppearance", async (req, res) => {
  const { name, mesh, material } = req.body;

  if (!name || !mesh || !material) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `UPDATE Players SET mesh = $1, material = $2 WHERE name = $3 RETURNING name, mesh, material`,
      [mesh, material, name]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ message: "Appearance updated", player: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Update error");
  }
});

// GET player appearance by name
router.get("/appearance", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Missing 'name' query parameter" });
  }

  try {
    const result = await pool.query(
      "SELECT mesh, material FROM Players WHERE name = $1",
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching appearance");
  }
});

// GET player by name
router.get("/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const result = await pool.query("SELECT name, level, money, mesh, material, pistol, rifle, shotgun, knife FROM Players WHERE name = $1", [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch player data" });
  }
});

// Update player money
router.put("/updateMoney", async (req, res) => {
  const { name, money } = req.body;
  if (!name || money === undefined) return res.status(400).json({ message: "Missing fields" });

  try {
    await pool.query("UPDATE Players SET money = $1 WHERE name = $2", [money, name]);
    res.json({ message: "Money updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update money" });
  }
});

//#region Weapons Updating

// Update player pistol
router.put("/updatePistol", async (req, res) => {
  const { name, level } = req.body;
  if (!name || level === undefined) return res.status(400).json({ message: "Missing fields" });

  try {
    await pool.query("UPDATE Players SET pistol = $1 WHERE name = $2", [level, name]);
    res.json({ message: "Pistol updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update pistol" });
  }
});

// Update player rifle
router.put("/updateRifle", async (req, res) => {
  const { name, level } = req.body;
  if (!name || level === undefined) return res.status(400).json({ message: "Missing fields" });

  try {
    await pool.query("UPDATE Players SET rifle = $1 WHERE name = $2", [level, name]);
    res.json({ message: "Rifle updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update rifle" });
  }
});

// Update player shotgun
router.put("/updateShotgun", async (req, res) => {
  const { name, level } = req.body;
  if (!name || level === undefined) return res.status(400).json({ message: "Missing fields" });

  try {
    await pool.query("UPDATE Players SET shotgun = $1 WHERE name = $2", [level, name]);
    res.json({ message: "Shotgun updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update shotgun" });
  }
});

// Update player knife
router.put("/updateKnife", async (req, res) => {
  const { name, level } = req.body;
  if (!name || level === undefined) return res.status(400).json({ message: "Missing fields" });

  try {
    await pool.query("UPDATE Players SET knife = $1 WHERE name = $2", [level, name]);
    res.json({ message: "Knife updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update knife" });
  }
});

//#endregion

module.exports = router;