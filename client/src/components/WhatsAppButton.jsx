const DEFAULT_WHATSAPP_NUMBER = "353868369203";

const normalizeWhatsAppNumber = (value) => String(value || "").replace(/\D/g, "") || DEFAULT_WHATSAPP_NUMBER;

const createWhatsAppUrl = (phone, message, useAppScheme) => {
  const normalizedPhone = normalizeWhatsAppNumber(phone);
  const encodedMessage = encodeURIComponent(message);

  if (useAppScheme) {
    return `whatsapp://send?phone=${normalizedPhone}&text=${encodedMessage}`;
  }

  return `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodedMessage}`;
};

const buildMessage = (itemTitle, itemPrice) => {
  if (itemTitle) {
    return itemPrice
      ? `I am interested in ${itemTitle} priced at ${itemPrice}`
      : `I am interested in ${itemTitle}. Could you share more details?`;
  }

  return "Hi, I'd like to know more about your antique shop.";
};

const isMobileDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};

export default function WhatsAppButton({
  itemTitle,
  itemPrice,
  label = "Enquire via WhatsApp",
  className = "",
  phoneNumber = DEFAULT_WHATSAPP_NUMBER,
}) {
  const message = buildMessage(itemTitle, itemPrice);
  const mobile = isMobileDevice();
  const href = createWhatsAppUrl(phoneNumber, message, mobile);
  const fallbackHref = createWhatsAppUrl(phoneNumber, message, false);

  const handleClick = () => {
    if (!mobile) {
      return;
    }

    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.location.replace(fallbackHref);
      }
    }, 600);
  };

  return (
    <div className="space-y-2">
      <a
        className={`inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:brightness-95 ${className}`}
        href={href}
        onClick={handleClick}
      >
        {label}
      </a>
    </div>
  );
}
