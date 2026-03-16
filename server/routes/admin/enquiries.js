const express = require("express");
const db = require("../../config/db");

const router = express.Router();

router.get("/", (_req, res) => {
  try {
    const enquiries = db
      .prepare(
        `
          SELECT
            e.id,
            e.name,
            e.email,
            e.message,
            e.item_id,
            e.item_reference,
            e.read,
            e.created_at,
            i.title AS item_title
          FROM enquiries e
          LEFT JOIN items i ON i.id = e.item_id
          ORDER BY e.created_at DESC, e.id DESC
        `
      )
      .all()
      .map((enquiry) => ({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        message: enquiry.message,
        itemId: enquiry.item_id,
        itemReference: enquiry.item_reference,
        read: Boolean(enquiry.read),
        createdAt: enquiry.created_at,
        item: enquiry.item_title ? { title: enquiry.item_title } : null,
      }));

    res.json({ enquiries, total: enquiries.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch enquiries" });
  }
});

router.patch("/:id", (req, res) => {
  try {
    const enquiry = db.prepare("SELECT id, read FROM enquiries WHERE id = ?").get(req.params.id);
    if (!enquiry) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }

    db.prepare("UPDATE enquiries SET read = 1 - read WHERE id = ?").run(req.params.id);
    const updated = db.prepare("SELECT id, read FROM enquiries WHERE id = ?").get(req.params.id);
    res.json({ enquiry: { id: updated.id, read: Boolean(updated.read) } });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update enquiry" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const enquiry = db.prepare("SELECT id FROM enquiries WHERE id = ?").get(req.params.id);
    if (!enquiry) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }

    db.prepare("DELETE FROM enquiries WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete enquiry" });
  }
});

module.exports = router;
