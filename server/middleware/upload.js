const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const { randomUUID } = require("crypto");
const { uploadsDir } = require("../config/storagePaths");

const MAX_WIDTH = 2200;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 84;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(extension)) {
      const error = new Error("Only jpg, jpeg, png, and webp files are allowed.");
      error.statusCode = 400;
      cb(error);
      return;
    }

    cb(null, true);
  },
});

const processUploadedImages = async (req, res, next) => {
  try {
    const files = req.files || [];

    req.files = await Promise.all(
      files.map(async (file) => {
        const originalExtension = path.extname(file.originalname).toLowerCase();
        const useJpeg = originalExtension === ".jpg" || originalExtension === ".jpeg";
        const outputExtension = useJpeg ? ".jpg" : ".webp";
        const filename = `${randomUUID()}${outputExtension}`;
        const outputPath = path.join(uploadsDir, filename);

        let pipeline = sharp(file.buffer, { failOn: "none" })
          .rotate()
          .resize({
            width: MAX_WIDTH,
            withoutEnlargement: true,
            fit: "inside",
          });

        pipeline = useJpeg ? pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }) : pipeline.webp({ quality: WEBP_QUALITY });

        await pipeline.toFile(outputPath);

        return {
          ...file,
          filename,
          path: outputPath,
          size: fs.statSync(outputPath).size,
        };
      })
    );

    next();
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    next(error);
  }
};

module.exports = [upload.array("images"), processUploadedImages];
