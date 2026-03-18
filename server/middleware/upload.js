const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");
const { uploadsDir } = require("../config/storagePaths");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(extension)) {
    cb(new Error("Only jpg, jpeg, png, and webp files are allowed."));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 10,
  },
});

module.exports = upload.array("images", 10);
