const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const admin = db.prepare("SELECT id, email, password_hash FROM admins WHERE email = ?").get(email.trim());

    if (!admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, email: admin.email });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to log in" });
  }
});

module.exports = router;
