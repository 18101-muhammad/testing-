const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { name, email, message, itemId, itemReference } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required" });
      return;
    }

    db.prepare(
      `
        INSERT INTO enquiries (name, email, message, item_id, item_reference)
        VALUES (?, ?, ?, ?, ?)
      `
    ).run(name.trim(), email.trim(), message.trim(), itemId || null, itemReference || null);

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to submit enquiry" });
  }
});

module.exports = router;
