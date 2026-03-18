require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { categories, items, sampleEnquiries, defaultAdmin } = require("../data/defaultData");

const bootstrap = async () => {
  const itemCount = db.prepare("SELECT COUNT(*) AS count FROM items").get().count;
  const enquiryCount = db.prepare("SELECT COUNT(*) AS count FROM enquiries").get().count;

  const insertCategory = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
  const insertItem = db.prepare(`
    INSERT INTO items (title, description, price, category_id, era, condition, images, featured, sold)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertAdmin = db.prepare("INSERT INTO admins (email, password_hash) VALUES (?, ?)");
  const insertEnquiry = db.prepare(`
    INSERT INTO enquiries (name, email, phone, message, item_id, item_reference, read)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const categoryIdBySlug = {};

  categories.forEach((category) => {
    const existing = db.prepare("SELECT id FROM categories WHERE slug = ?").get(category.slug);

    if (existing) {
      categoryIdBySlug[category.slug] = existing.id;
      return;
    }

    const result = insertCategory.run(category.name, category.slug);
      categoryIdBySlug[category.slug] = result.lastInsertRowid;
  });

  if (itemCount === 0) {
    items.forEach(([title, description, price, categorySlug, era, condition, featured, sold]) => {
      insertItem.run(
        title,
        description,
        price,
        categoryIdBySlug[categorySlug],
        era,
        condition,
        JSON.stringify(["/uploads/placeholder.jpg"]),
        featured,
        sold
      );
    });
  } else {
    console.log(`Bootstrap skipped sample items: ${itemCount} items already exist.`);
  }

  const adminExists = db.prepare("SELECT id FROM admins WHERE email = ?").get(defaultAdmin.email);
  if (!adminExists) {
    const passwordHash = await bcrypt.hash(defaultAdmin.password, 10);
    insertAdmin.run(defaultAdmin.email, passwordHash);
    console.log(`Default admin restored: ${defaultAdmin.email}`);
  }

  if (itemCount === 0 && enquiryCount === 0) {
    sampleEnquiries.forEach(([name, email, phone, message, itemId, itemReference, read]) => {
      insertEnquiry.run(name, email, phone, message, itemId, itemReference, read);
    });
  }

  console.log("Bootstrap complete: sample categories, items, enquiries, and admin created.");
  console.log(`Admin login: ${defaultAdmin.email} / ${defaultAdmin.password}`);
};

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
