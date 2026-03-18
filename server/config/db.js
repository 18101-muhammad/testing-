const Database = require("better-sqlite3");
require("dotenv").config();
const { dbPath } = require("./storagePaths");

const db = new Database(dbPath, { verbose: console.log });

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category_id INTEGER NOT NULL,
    era TEXT,
    condition TEXT,
    images TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    sold INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    item_id INTEGER,
    item_reference TEXT,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (item_id) REFERENCES items(id)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);

const enquiryColumns = db.prepare("PRAGMA table_info(enquiries)").all();
if (!enquiryColumns.some((column) => column.name === "item_reference")) {
  db.exec("ALTER TABLE enquiries ADD COLUMN item_reference TEXT");
}
if (!enquiryColumns.some((column) => column.name === "phone")) {
  db.exec("ALTER TABLE enquiries ADD COLUMN phone TEXT");
}

console.log("SQLite database ready at", dbPath);

module.exports = db;
