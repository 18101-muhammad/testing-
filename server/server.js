require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

require("./config/db");
const { uploadsDir } = require("./config/storagePaths");

const authMiddleware = require("./middleware/auth");
const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

app.use("/api/items", require("./routes/items"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/whatsapp-link", require("./routes/whatsapp"));
app.use("/api/admin/login", require("./routes/admin/auth"));
app.use("/api/admin/items", authMiddleware, require("./routes/admin/items"));
app.use("/api/admin/categories", authMiddleware, require("./routes/admin/categories"));
app.use("/api/admin/enquiries", authMiddleware, require("./routes/admin/enquiries"));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Antique shop API is running" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);

  if (err.name === "MulterError") {
    const statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    res.status(statusCode).json({ error: err.message || "Upload failed" });
    return;
  }

  res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
