const express = require("express");
const db = require("../config/db");

const router = express.Router();
const DEFAULT_WHATSAPP_NUMBER = "353868369203";

const normalizeWhatsAppNumber = (value) => {
  const digitsOnly = String(value || "").replace(/\D/g, "");
  return digitsOnly || DEFAULT_WHATSAPP_NUMBER;
};

const buildWhatsAppUrl = (itemId) => {
  const whatsappNumber = normalizeWhatsAppNumber(process.env.WHATSAPP_NUMBER);
  let message = "Hi, I'd like to know more about your antique shop.";

  if (itemId) {
    const item = db.prepare("SELECT title, price FROM items WHERE id = ?").get(itemId);
    if (item) {
      message = `I am interested in ${item.title} priced at EUR ${item.price}`;
    }
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

router.get("/", (req, res) => {
  try {
    const { itemId } = req.query;
    res.json({ url: buildWhatsAppUrl(itemId) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to build WhatsApp link" });
  }
});

module.exports = router;
