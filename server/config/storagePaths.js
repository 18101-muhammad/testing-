const fs = require("fs");
const path = require("path");

const serverRoot = path.resolve(__dirname, "..");
const defaultDataRoot = serverRoot;

const resolveConfiguredPath = (configuredPath, fallbackPath) => {
  if (configuredPath) {
    return path.resolve(configuredPath);
  }

  return path.resolve(fallbackPath);
};

const dataRoot = resolveConfiguredPath(process.env.DATA_DIR, defaultDataRoot);
const uploadsDir = resolveConfiguredPath(process.env.UPLOAD_DIR, path.join(dataRoot, "uploads"));
const dbPath = resolveConfiguredPath(process.env.DB_PATH, path.join(dataRoot, "db", "antiqueshop.db"));

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

module.exports = {
  dbPath,
  uploadsDir,
};
