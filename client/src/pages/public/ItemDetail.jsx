import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
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
        <title>{item.title} | Never The Twain</title>
      </Helmet>

      <section className="section-shell pt-14">
        <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="editorial-card relative overflow-hidden rounded-[34px] shadow-soft">
              <img alt={item.title} className="aspect-[4/3] w-full bg-[#e9dfcf] object-contain p-4" src={mainImage} />
              {item.sold ? (
                <span className="absolute left-5 top-5 rounded-full bg-[#5c2f2b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Sold
                </span>
              ) : null}
            </div>

            {gallery.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image) => (
                  <button
                    className={`overflow-hidden rounded-2xl border p-1 ${selectedImage === image ? "border-[#b68a3c] bg-[#f0e7d7]" : "border-[#2f382d]/10 bg-white/70"}`}
                    key={image}
                    onClick={() => setSelectedImage(image)}
                    type="button"
                  >
                    <img alt={item.title} className="aspect-square w-full rounded-xl object-cover" src={buildImageUrl(image)} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="editorial-card rounded-[34px] p-8 shadow-soft">
              <p className="eyebrow">Collection Detail</p>
              <h1 className="mt-4 font-display text-5xl leading-tight text-[#263024]">{item.title}</h1>

              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6c6557]">
                {item.era ? <span>{item.era}</span> : null}
                {item.condition ? <span>{item.condition}</span> : null}
                {item.category?.name || item.category ? <span>{item.category?.name || item.category}</span> : null}
              </div>

              <p className="mt-8 font-display text-4xl text-[#b68a3c]">{formattedPrice}</p>
              <p className="mt-6 text-base leading-8 text-[#5f584b]">{item.description}</p>
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
    </>
  );
}
