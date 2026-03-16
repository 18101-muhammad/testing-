const express = require("express");
const db = require("../config/db");

const router = express.Router();

const parseItemRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  price: row.price,
  era: row.era,
  condition: row.condition,
  images: JSON.parse(row.images || "[]"),
  featured: Boolean(row.featured),
  sold: Boolean(row.sold),
  createdAt: row.created_at,
  category: {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
  },
});

router.get("/", (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, featured } = req.query;
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push("c.slug = ?");
      params.push(category);
    }

    if (search) {
      conditions.push("(i.title LIKE ? OR i.description LIKE ? OR i.era LIKE ? OR i.condition LIKE ? OR c.name LIKE ?)");
      const wildcard = `%${search}%`;
      params.push(wildcard, wildcard, wildcard, wildcard, wildcard);
    }

    if (minPrice) {
      conditions.push("i.price >= ?");
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      conditions.push("i.price <= ?");
      params.push(Number(maxPrice));
    }

    if (featured !== undefined && featured !== "") {
      const isFeatured = featured === "true" || featured === "1" ? 1 : 0;
      conditions.push("i.featured = ?");
      params.push(isFeatured);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = db
      .prepare(
        `
          SELECT
            i.*,
            c.id AS category_id,
            c.name AS category_name,
            c.slug AS category_slug
          FROM items i
          JOIN categories c ON c.id = i.category_id
          ${whereClause}
          ORDER BY i.created_at DESC, i.id DESC
        `
      )
      .all(...params);

    const items = rows.map(parseItemRow);
    res.json({ items, total: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch items" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const row = db
      .prepare(
        `
          SELECT
            i.*,
            c.id AS category_id,
            c.name AS category_name,
            c.slug AS category_slug
          FROM items i
          JOIN categories c ON c.id = i.category_id
          WHERE i.id = ?
        `
      )
      .get(req.params.id);

    if (!row) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json({ item: parseItemRow(row) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch item" });
  }
});

module.exports = router;
