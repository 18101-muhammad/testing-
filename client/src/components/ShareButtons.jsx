import { useMemo, useState } from "react";

export default function ShareButtons({ title, imageUrl }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const links = useMemo(
    () => [
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      },
      {
        label: "X",
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
      },
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodeURIComponent(`${title} ${currentUrl}`)}`,
      },
      {
        label: "Pinterest",
        href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(imageUrl)}`,
      },
    ],
    [currentUrl, imageUrl, title]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          className="rounded-full border border-antique-navy/15 px-4 py-2 text-sm font-semibold text-antique-navy hover:border-antique-gold hover:text-antique-gold"
          href={link.href}
          rel="noreferrer"
          target="_blank"
        >
          {link.label}
        </a>
      ))}

      <button
        className="rounded-full border border-antique-navy/15 px-4 py-2 text-sm font-semibold text-antique-navy hover:border-antique-gold hover:text-antique-gold"
        onClick={handleCopy}
        type="button"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
