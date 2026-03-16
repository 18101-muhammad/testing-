import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { buildImageUrl, getItemById, getItems } from "../../api/api";
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

  return (
    <>
      <Helmet>
        <title>{item.title} | The Antique Room</title>
      </Helmet>

      <section className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[32px] bg-white shadow-soft">
              <img alt={item.title} className="aspect-[4/3] w-full bg-antique-light-gold object-contain p-4" src={mainImage} />
              {item.sold ? (
                <span className="absolute left-5 top-5 rounded-full bg-red-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  SOLD
                </span>
              ) : null}
            </div>

            {gallery.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image) => (
                  <button
                    className={`overflow-hidden rounded-2xl border-2 ${selectedImage === image ? "border-antique-gold" : "border-transparent"}`}
                    key={image}
                    onClick={() => setSelectedImage(image)}
                    type="button"
                  >
                    <img alt={item.title} className="aspect-square w-full object-cover" src={buildImageUrl(image)} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="eyebrow">Collection Detail</p>
              <h1 className="font-display text-5xl text-antique-navy">{item.title}</h1>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-antique-muted">
                {item.era ? <span className="rounded-full bg-antique-light-gold px-3 py-1">{item.era}</span> : null}
                {item.condition ? <span className="rounded-full bg-slate-100 px-3 py-1">{item.condition}</span> : null}
                {item.category?.name || item.category ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1">{item.category?.name || item.category}</span>
                ) : null}
              </div>
            </div>

            <p className="text-4xl font-bold text-antique-gold">
              {item.price != null ? `€${Number(item.price).toLocaleString()}` : "Price on request"}
            </p>

            <Link
              className="btn-primary justify-center"
              to={`/contact?itemReference=${encodeURIComponent(item.title)}`}
            >
              Enquire
            </Link>

            <p className="text-base leading-8 text-antique-muted">{item.description}</p>

            <div className="space-y-4 rounded-[28px] border border-antique-gold/15 bg-white p-6 shadow-soft">
              <WhatsAppButton itemId={item._id || item.id} />
              <ShareButtons imageUrl={mainImage} title={item.title} />
            </div>
          </div>
        </div>
      </section>

      {relatedItems.length ? (
        <section className="bg-white">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">You May Also Like</p>
                <h2 className="section-title">Related Pieces</h2>
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
