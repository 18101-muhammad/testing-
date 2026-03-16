import { useState } from "react";
import { getWhatsAppLink } from "../api/api";

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

      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setError("WhatsApp is unavailable right now. Please try again shortly.");
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
