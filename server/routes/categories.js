const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/", (_req, res) => {
  try {
    const categories = db
      .prepare(
        `
          SELECT
            c.id,
            c.name,
            c.slug,
            COUNT(i.id) AS itemCount
          FROM categories c
          LEFT JOIN items i ON i.category_id = c.id
          GROUP BY c.id
          ORDER BY c.name ASC
        `
      )
      .all()
      .map((category) => ({
        ...category,
        itemCount: Number(category.itemCount),
      }));

    res.json({ categories, total: categories.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch categories" });
  }
});

module.exports = router;
