const express = require("express");
const db = require("../config/db");

const router = express.Router();

const buildRedirectUrl = (itemId) => {
  const baseUrl = "http://localhost:5000/api/whatsapp-link/open";
  return itemId ? `${baseUrl}?itemId=${encodeURIComponent(itemId)}` : baseUrl;
};

router.get("/", (req, res) => {
  try {
    const { itemId } = req.query;
    res.json({ url: buildRedirectUrl(itemId) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to build WhatsApp link" });
  }
});

router.get("/open", (req, res) => {
  try {
    const { itemId } = req.query;
    const whatsappNumber = process.env.WHATSAPP_NUMBER;

    let message = "Hi, I'd like to know more about your antique shop.";

    if (itemId) {
      const item = db.prepare("SELECT title, price FROM items WHERE id = ?").get(itemId);
      if (item) {
        message = `Hi, I'm interested in: ${item.title} (EUR ${item.price}). Could you give me more details?`;
      }
    }

    const redirectUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    res.redirect(302, redirectUrl);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to redirect to WhatsApp" });
  }
});

module.exports = router;
