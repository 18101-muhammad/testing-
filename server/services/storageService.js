const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { uploadsDir } = require("../config/storagePaths");

const save = (file) => {
  if (!file) {
    return null;
  }

  if (file.path && path.resolve(path.dirname(file.path)) === path.resolve(uploadsDir)) {
    return `/uploads/${path.basename(file.path)}`;
  }

  const extension = path.extname(file.originalname || file.path || "");
  const filename = `${randomUUID()}${extension}`;
  const targetPath = path.join(uploadsDir, filename);
  fs.renameSync(file.path, targetPath);
  return `/uploads/${filename}`;
};

const deleteFile = (filePath) => {
  if (!filePath) {
    return;
  }

  const absolutePath = path.join(uploadsDir, path.basename(filePath));

  try {
    fs.unlinkSync(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to delete file:", absolutePath, error.message);
    }
  }
};

const getUrl = (filePath) => `http://localhost:5000${filePath}`;

module.exports = { save, deleteFile, getUrl };
