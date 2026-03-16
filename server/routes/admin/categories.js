const express = require("express");
const db = require("../../config/db");

const router = express.Router();

const slugify = (value) => value.toLowerCase().trim().replace(/\s+/g, "-");

router.post("/", (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }

    const slug = slugify(name);
    const result = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)").run(name.trim(), slug);
    const category = db.prepare("SELECT id, name, slug FROM categories WHERE id = ?").get(result.lastInsertRowid);

    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create category" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }

    const category = db.prepare("SELECT id FROM categories WHERE id = ?").get(req.params.id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const slug = slugify(name);
    db.prepare("UPDATE categories SET name = ?, slug = ? WHERE id = ?").run(name.trim(), slug, req.params.id);
    const updated = db.prepare("SELECT id, name, slug FROM categories WHERE id = ?").get(req.params.id);
    res.json({ category: updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update category" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const category = db.prepare("SELECT id, name FROM categories WHERE id = ?").get(req.params.id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const usage = db.prepare("SELECT COUNT(*) AS count FROM items WHERE category_id = ?").get(req.params.id);
    if (usage.count > 0) {
      res.status(400).json({ error: `Cannot delete: ${usage.count} items use this category` });
      return;
    }

    db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete category" });
  }
});

module.exports = router;
