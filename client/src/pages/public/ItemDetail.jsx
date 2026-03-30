import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { buildImageUrl, getItemById, getItems, submitEnquiry } from "../../api/api";
import ItemCard from "../../components/ItemCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ShareButtons from "../../components/ShareButtons";
import WhatsAppButton from "../../components/WhatsAppButton";

const normalizeImages = (item) => {
  if (Array.isArray(item?.images) && item.images.length) {
    return item.images.map((image) => (typeof image === "string" ? image : image?.url || image?.path)).filter(Boolean);
  }

  return [item?.image || item?.imageUrl || item?.thumbnail].filter(Boolean);
};

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [buyNowForm, setBuyNowForm] = useState({ name: "", email: "", phone: "", comment: "" });
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [buyNowError, setBuyNowError] = useState("");
  const [buyNowSuccess, setBuyNowSuccess] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getItemById(id);
        const itemData = response?.item || response;
        setItem(itemData);
        const images = normalizeImages(itemData);
        setSelectedImage(images[0] || "");

        const categoryValue = itemData?.category?.slug || itemData?.category?.name || itemData?.category;
        if (categoryValue) {
          const relatedResponse = await getItems({ category: categoryValue });
          const related = (relatedResponse?.items || relatedResponse || []).filter(
            (entry) => (entry._id || entry.id) !== (itemData._id || itemData.id)
          );
          setRelatedItems(related.slice(0, 4));
        }
      } catch {
        setError("We could not load this item right now. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const gallery = useMemo(() => normalizeImages(item), [item]);
  const selectedImageIndex = Math.max(gallery.findIndex((image) => image === selectedImage), 0);
  const showPreviousImage = useCallback(() => {
    if (!gallery.length) return;
    const nextIndex = selectedImageIndex <= 0 ? gallery.length - 1 : selectedImageIndex - 1;
    setSelectedImage(gallery[nextIndex]);
  }, [gallery, selectedImageIndex]);
  const showNextImage = useCallback(() => {
    if (!gallery.length) return;
    const nextIndex = selectedImageIndex >= gallery.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImage(gallery[nextIndex]);
  }, [gallery, selectedImageIndex]);
  const openLightboxAt = useCallback((image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery.length, lightboxOpen, showNextImage, showPreviousImage]);

  if (loading) {
    return <LoadingSpinner label="Loading antique details..." />;
  }

  if (error || !item) {
    return (
      <section className="section-shell">
        <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error || "This item could not be found."}</p>
      </section>
    );
  }

  const mainImage = buildImageUrl(selectedImage || gallery[0]);
  const itemId = item._id || item.id;
  const formattedPrice = item.price != null ? `EUR ${Number(item.price).toLocaleString()}` : "Price on request";
  const enquireMessage = `I'm interested in ${item.title}. Could you share more details about availability and purchase options?`;

  const handleBuyNowChange = (event) => {
    const { name, value } = event.target;
    setBuyNowForm((current) => ({ ...current, [name]: value }));
  };

  const handleBuyNowSubmit = async (event) => {
    event.preventDefault();

    try {
      setBuyNowLoading(true);
      setBuyNowError("");
      setBuyNowSuccess("");
      await submitEnquiry({
        name: buyNowForm.name,
        email: buyNowForm.email,
        phone: buyNowForm.phone,
        itemId,
        itemReference: item.title,
        message: `Buy Now request for ${item.title} (${formattedPrice}). Buyer would like to proceed with purchase.${buyNowForm.comment ? ` Comment: ${buyNowForm.comment}` : ""}`,
      });
      setBuyNowSuccess("Thank you. We will contact you shortly.");
      setBuyNowForm({ name: "", email: "", phone: "", comment: "" });
    } catch {
      setBuyNowError("We could not submit your purchase enquiry right now. Please try again.");
    } finally {
      setBuyNowLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{item.title} | Twain Antiques & Curios</title>
      </Helmet>

      <section className="section-shell pt-14">
        <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <button
              className="editorial-outline editorial-card relative block w-full overflow-hidden rounded-[34px] shadow-soft"
              onClick={() => openLightboxAt(selectedImage || gallery[0])}
              type="button"
            >
              <img alt={item.title} className="aspect-[4/3] w-full bg-[#e9dfcf] object-contain p-4" decoding="async" fetchPriority="high" src={mainImage} />
              {item.sold ? (
                <span className="absolute left-5 top-5 rounded-full bg-[#5c2f2b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Sold
                </span>
              ) : null}
              <div className="absolute bottom-5 left-5 z-[2] rounded-[24px] border border-white/15 bg-black/35 px-4 py-3 text-white backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d6b57d]">Main image</p>
                <p className="mt-2 font-display text-2xl leading-tight">{item.title}</p>
              </div>
            </button>

            {gallery.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    className={`overflow-hidden rounded-2xl border p-1 ${selectedImage === image ? "border-[#b68a3c] bg-[#f0e7d7]" : "border-[#2f382d]/10 bg-white/70"}`}
                    key={image}
                    onClick={() => openLightboxAt(image)}
                    type="button"
                  >
                    <img alt={item.title} className="aspect-square w-full rounded-xl object-cover" decoding="async" loading="lazy" src={buildImageUrl(image)} />
                    <span className="block px-2 pb-2 pt-2 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b564a]">
                      {index === 0 ? "Primary view" : `View ${index + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="paper-panel editorial-card rounded-[34px] p-8 shadow-soft">
              <p className="eyebrow">Collection Detail</p>
              <h1 className="mt-4 font-display text-5xl leading-tight text-[#263024]">{item.title}</h1>

              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6c6557]">
                {item.era ? <span>{item.era}</span> : null}
                {item.condition ? <span>{item.condition}</span> : null}
                {item.category?.name || item.category ? <span>{item.category?.name || item.category}</span> : null}
              </div>

              <p className="mt-8 font-display text-4xl text-[#b68a3c]">{formattedPrice}</p>
              <p className="mt-6 text-base leading-8 text-[#5f584b]">{item.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] bg-white/70 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b68a3c]">Era</p>
                  <p className="mt-2 text-sm font-semibold text-[#263024]">{item.era || "Not specified"}</p>
                </div>
                <div className="rounded-[24px] bg-white/70 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b68a3c]">Condition</p>
                  <p className="mt-2 text-sm font-semibold text-[#263024]">{item.condition || "Not specified"}</p>
                </div>
                <div className="rounded-[24px] bg-white/70 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b68a3c]">Category</p>
                  <p className="mt-2 text-sm font-semibold text-[#263024]">{item.category?.name || item.category || "General collection"}</p>
                </div>
              </div>
            </div>

            <div className="editorial-card rounded-[34px] p-6 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <WhatsAppButton className="w-full sm:w-auto" itemPrice={formattedPrice} itemTitle={item.title} />
                <button
                  className="btn-primary w-full sm:w-auto"
                  onClick={() => {
                    setBuyNowOpen(true);
                    setBuyNowError("");
                    setBuyNowSuccess("");
                  }}
                  type="button"
                >
                  Buy Now
                </button>
                <Link
                  className="btn-secondary w-full sm:w-auto"
                  to={`/contact?itemReference=${encodeURIComponent(item.title)}&message=${encodeURIComponent(enquireMessage)}`}
                >
                  Enquire
                </Link>
              </div>
              <div className="mt-5 border-t border-[#2f382d]/10 pt-5">
                <ShareButtons imageUrl={mainImage} title={item.title} />
              </div>
            </div>

            <div className="editorial-card rounded-[34px] bg-[#232820] p-6 text-[#efe6d5] shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d6b57d]">Appointments</p>
              <p className="mt-4 text-sm leading-8 text-[#efe6d5]/78">
                If you would like more images, dimensions, or a private viewing, send an enquiry and we will reply with detail rather than a generic stock response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {buyNowOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
          <div className="w-full max-w-lg rounded-[32px] bg-[#f8f3e9] p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Purchase Request</p>
                <h2 className="mt-3 font-display text-4xl text-[#263024]">Buy Now</h2>
                <p className="mt-3 text-sm leading-7 text-[#625d52]">
                  Submit your details and we will follow up about purchasing <span className="font-semibold text-[#263024]">{item.title}</span>.
                </p>
              </div>
              <button
                aria-label="Close buy now form"
                className="rounded-full border border-[#2f382d]/10 px-3 py-2 text-sm font-semibold text-[#596355] hover:bg-white/70"
                onClick={() => setBuyNowOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[#ece3d2] p-4 text-sm text-[#2b3427]">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-[#625d52]">{formattedPrice}</p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleBuyNowSubmit}>
              <input className="form-input" name="name" onChange={handleBuyNowChange} placeholder="Your name" required value={buyNowForm.name} />
              <input className="form-input" name="email" onChange={handleBuyNowChange} placeholder="Email address" required type="email" value={buyNowForm.email} />
              <input className="form-input" name="phone" onChange={handleBuyNowChange} placeholder="Phone number" required value={buyNowForm.phone} />
              <textarea className="form-input min-h-[120px]" name="comment" onChange={handleBuyNowChange} placeholder="Comment (optional)" value={buyNowForm.comment} />

              {buyNowSuccess ? <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">{buyNowSuccess}</p> : null}
              {buyNowError ? <p className="rounded-2xl bg-red-50 p-4 text-red-700">{buyNowError}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="btn-primary flex-1" disabled={buyNowLoading} type="submit">
                  {buyNowLoading ? "Submitting..." : "Submit Buy Now Request"}
                </button>
                <button className="btn-secondary flex-1" onClick={() => setBuyNowOpen(false)} type="button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {relatedItems.length ? (
        <section className="bg-[#ece3d5]/65">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">You May Also Like</p>
                <h2 className="section-title">Related pieces</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedItems.map((relatedItem) => (
                <ItemCard item={relatedItem} key={relatedItem._id || relatedItem.id} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[70] bg-black/95"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute left-4 right-4 top-4 z-[2] flex items-center justify-between gap-4 text-white">
            <div className="min-w-0">
              <p className="truncate font-display text-xl sm:text-2xl">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/60">
                {selectedImageIndex + 1} / {gallery.length}
              </p>
            </div>
            <button
              aria-label="Close image viewer"
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm"
              onClick={() => setLightboxOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>

          {gallery.length > 1 ? (
            <>
              <button
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-[2] -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-sm"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                type="button"
              >
                ‹
              </button>
              <button
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-[2] -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-sm"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                type="button"
              >
                ›
              </button>
            </>
          ) : null}

          <div
            className="flex h-full items-center justify-center px-4 pb-24 pt-20 sm:px-8"
            onClick={(event) => event.stopPropagation()}
            onTouchEnd={() => {
              if (touchStartX.current == null || touchEndX.current == null) return;
              const distance = touchStartX.current - touchEndX.current;
              if (Math.abs(distance) > 50) {
                if (distance > 0) showNextImage();
                else showPreviousImage();
              }
              touchStartX.current = null;
              touchEndX.current = null;
            }}
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
              touchEndX.current = null;
            }}
            onTouchMove={(event) => {
              touchEndX.current = event.changedTouches[0]?.clientX ?? null;
            }}
          >
            <TransformWrapper doubleClick={{ mode: "zoomIn" }} pinch={{ step: 5 }} panning={{ velocityDisabled: true }} wheel={{ step: 0.15 }}>
              <TransformComponent
                contentClass="flex items-center justify-center"
                wrapperClass="!h-full !w-full !max-w-6xl"
              >
                <img
                  alt={item.title}
                  className="max-h-[78vh] w-auto max-w-full object-contain"
                  decoding="async"
                  fetchPriority="high"
                  src={buildImageUrl(gallery[selectedImageIndex])}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>

          {gallery.length > 1 ? (
            <div className="absolute inset-x-0 bottom-0 z-[2] overflow-x-auto px-4 pb-4">
              <div className="mx-auto flex w-max gap-3 rounded-[24px] border border-white/10 bg-black/35 p-3 backdrop-blur-sm">
                {gallery.map((image, index) => (
                  <button
                    className={`overflow-hidden rounded-2xl border ${selectedImageIndex === index ? "border-[#d6b57d]" : "border-white/10"}`}
                    key={image}
                    onClick={() => setSelectedImage(image)}
                    type="button"
                  >
                    <img alt={`${item.title} ${index + 1}`} className="h-16 w-16 object-cover" src={buildImageUrl(image)} />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
