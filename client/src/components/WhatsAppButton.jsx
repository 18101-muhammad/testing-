import { useState } from "react";
import { getWhatsAppLink } from "../api/api";

const DEFAULT_WHATSAPP_NUMBER = "353868369203";

const createWhatsAppUrl = (phone, message) =>
  `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

const buildFallbackUrl = (itemId) => {
  const message = itemId
    ? "Hi, I would like to know more about this item."
    : "Hi, I'd like to know more about your antique shop.";

  return createWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, message);
};

export default function WhatsAppButton({ itemId, label = "Enquire via WhatsApp", className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getWhatsAppLink(itemId);
      const url = result?.url || result?.link;

      if (!url) {
        throw new Error("WhatsApp link is unavailable.");
      }

      window.location.assign(url);
    } catch {
      window.location.assign(buildFallbackUrl(itemId));
      setError("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        className={`inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:brightness-95 ${className}`}
        disabled={loading}
        onClick={handleClick}
        type="button"
      >
        <span className="text-lg">◔</span>
        {loading ? "Opening WhatsApp..." : label}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
