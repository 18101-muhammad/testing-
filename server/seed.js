require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

const categories = [
  { name: "Furniture", slug: "furniture" },
  { name: "Jewellery", slug: "jewellery" },
  { name: "Clocks & Timepieces", slug: "clocks-timepieces" },
  { name: "Art & Paintings", slug: "art-paintings" },
  { name: "Ceramics & Pottery", slug: "ceramics-pottery" },
  { name: "Silver & Silverware", slug: "silver-silverware" },
];

const items = [
  ["Victorian Mahogany Writing Desk", "A richly grained Victorian desk with elegant drawers and brass hardware.", 1250, "furniture", "Late 19th Century", "Very Good", 1, 0],
  ["Georgian Silver Candelabra", "A refined Georgian silver candelabra with balanced detailing and classic form.", 875, "silver-silverware", "Early 19th Century", "Excellent", 0, 0],
  ["Art Deco Mantel Clock", "An Art Deco clock with stepped geometry and polished metal trim.", 420, "clocks-timepieces", "Early 20th Century", "Very Good", 1, 0],
  ["Edwardian Pearl Brooch", "A delicate Edwardian brooch set with luminous seed pearls.", 340, "jewellery", "Early 20th Century", "Good", 0, 0],
  ["Victorian Blue Willow Dinner Set", "A decorative Blue Willow set with classic transferware motifs.", 290, "ceramics-pottery", "Late 19th Century", "Good", 0, 0],
  ["Oil Painting Irish Landscape 1890s", "A late nineteenth-century Irish landscape with rich colour and atmosphere.", 1800, "art-paintings", "Late 19th Century", "Very Good", 1, 0],
  ["Georgian Oak Longcase Clock", "A tall Georgian longcase clock in oak with a beautifully aged face.", 2100, "clocks-timepieces", "Early 19th Century", "Good", 0, 0],
  ["Art Nouveau Bronze Vase", "A sculptural bronze vase with fluid Art Nouveau curves and natural forms.", 560, "ceramics-pottery", "Early 20th Century", "Very Good", 0, 0],
  ["Edwardian Mahogany Display Cabinet", "A refined display cabinet with glazed doors and warm mahogany finish.", 980, "furniture", "Early 20th Century", "Very Good", 0, 0],
  ["Victorian Gold Locket Necklace", "A Victorian gold locket necklace with ornate engraved detailing.", 450, "jewellery", "Late 19th Century", "Good", 0, 0],
  ["Georgian Sterling Silver Tea Set", "A sterling silver tea service with matching pieces and elegant handles.", 1650, "silver-silverware", "Early 19th Century", "Excellent", 0, 0],
  ["Tudor Oak Coffer Chest", "A substantial Tudor-style oak coffer chest full of rustic character.", 3200, "furniture", "Early 19th Century", "Good", 1, 0],
];

const sampleEnquiries = [
  ["Aoife Murphy", "aoife@example.com", "+353860001111", "Is the Victorian desk available for delivery within Dublin?", 1, null, 0],
  ["Liam Byrne", "liam@example.com", "+353860002222", "Could you share more photos of the silver tea set?", 11, null, 1],
  ["Sophie Walsh", "sophie@example.com", "+353860003333", "I am looking for a decorative antique mirror. Can you help source one?", null, "General sourcing request", 0],
];

const seed = async () => {
  db.exec(`
    DELETE FROM enquiries;
    DELETE FROM items;
    DELETE FROM categories;
    DELETE FROM admins;
    DELETE FROM sqlite_sequence WHERE name IN ('items','categories','enquiries','admins');
  `);

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
    const result = insertCategory.run(category.name, category.slug);
    categoryIdBySlug[category.slug] = result.lastInsertRowid;
  });

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

  const passwordHash = await bcrypt.hash("Admin1234!", 10);
  insertAdmin.run("admin@antiqueshop.com", passwordHash);

  sampleEnquiries.forEach(([name, email, phone, message, itemId, itemReference, read]) => {
    insertEnquiry.run(name, email, phone, message, itemId, itemReference, read);
  });

  console.log("✓ Database seeded!");
  console.log("Items: 12 | Categories: 6");
  console.log("Admin login: admin@antiqueshop.com / Admin1234!");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
