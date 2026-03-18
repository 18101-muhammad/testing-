const express = require("express");
const db = require("../../config/db");
const upload = require("../../middleware/upload");
const { deleteFile } = require("../../services/storageService");

const router = express.Router();

const normalizeImages = (images) => {
  try {
    return JSON.parse(images || "[]");
  } catch (_error) {
    return [];
  }
};

const parseItemRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  price: row.price,
  era: row.era,
  condition: row.condition,
  images: normalizeImages(row.images),
  featured: Boolean(row.featured),
  sold: Boolean(row.sold),
  createdAt: row.created_at,
  category: {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
  },
});

router.get("/", (_req, res) => {
  try {
    const items = db
      .prepare(
        `
          SELECT
            i.*,
            c.id AS category_id,
            c.name AS category_name,
            c.slug AS category_slug
          FROM items i
          JOIN categories c ON c.id = i.category_id
          ORDER BY i.created_at DESC, i.id DESC
        `
      )
      .all()
      .map(parseItemRow);

    res.json({ items, total: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch admin items" });
  }
});

router.post("/", upload, (req, res) => {
  try {
    const { title, description, price, category, era, condition, featured, sold } = req.body;

    if (!title || !description || !price || !category) {
      res.status(400).json({ error: "Title, description, price, and category are required" });
      return;
    }

    const imagePaths = (req.files || []).map((file) => `/uploads/${file.filename}`);
    const result = db
      .prepare(
        `
          INSERT INTO items (title, description, price, category_id, era, condition, images, featured, sold)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        title.trim(),
        description.trim(),
        Number(price),
        Number(category),
        era || null,
        condition || null,
        JSON.stringify(imagePaths),
        featured === "true" || featured === "1" ? 1 : 0,
        sold === "true" || sold === "1" ? 1 : 0
      );

    const created = db
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
      .get(result.lastInsertRowid);

    res.status(201).json({ item: parseItemRow(created) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create item" });
  }
});

router.put("/:id", upload, (req, res) => {
  try {
    const existing = db.prepare("SELECT * FROM items WHERE id = ?").get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    const {
      title,
      description,
      price,
      category,
      era,
      condition,
      featured,
      sold,
      removedImages,
      removeImages,
    } = req.body;

    let currentImages = normalizeImages(existing.images);
    const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    let imagesToRemove = [];
    if (removedImages) {
      try {
        imagesToRemove = imagesToRemove.concat(JSON.parse(removedImages));
      } catch (_error) {
        imagesToRemove = imagesToRemove.concat([removedImages]);
      }
    }
    if (removeImages) {
      imagesToRemove = imagesToRemove.concat(Array.isArray(removeImages) ? removeImages : [removeImages]);
    }

    imagesToRemove = [...new Set(imagesToRemove.filter(Boolean))];
    imagesToRemove.forEach((imagePath) => deleteFile(imagePath));
    currentImages = currentImages.filter((imagePath) => !imagesToRemove.includes(imagePath));
    currentImages = currentImages.concat(uploadedImages);

    db.prepare(
      `
        UPDATE items
        SET title = ?, description = ?, price = ?, category_id = ?, era = ?, condition = ?, images = ?, featured = ?, sold = ?
        WHERE id = ?
      `
    ).run(
      title ? title.trim() : existing.title,
      description ? description.trim() : existing.description,
      price !== undefined ? Number(price) : existing.price,
      category ? Number(category) : existing.category_id,
      era !== undefined ? era : existing.era,
      condition !== undefined ? condition : existing.condition,
      JSON.stringify(currentImages),
      featured === undefined ? existing.featured : featured === "true" || featured === "1" ? 1 : 0,
      sold === undefined ? existing.sold : sold === "true" || sold === "1" ? 1 : 0,
      req.params.id
    );

    const updated = db
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

    res.json({ item: parseItemRow(updated) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update item" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const existing = db.prepare("SELECT id, title, images FROM items WHERE id = ?").get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    normalizeImages(existing.images).forEach((imagePath) => {
      if (imagePath !== "/uploads/placeholder.jpg") {
        deleteFile(imagePath);
      }
    });

    db.prepare(
      `
        UPDATE enquiries
        SET item_reference = COALESCE(item_reference, ?), item_id = NULL
        WHERE item_id = ?
      `
    ).run(existing.title, req.params.id);

    db.prepare("DELETE FROM items WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete item" });
  }
});

module.exports = router;
