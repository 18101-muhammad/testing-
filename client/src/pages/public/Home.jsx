import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { buildImageUrl, getCategories, getItems } from "../../api/api";
import ItemCard from "../../components/ItemCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const firstImage = (item) => {
  if (Array.isArray(item?.images) && item.images.length) {
    const image = item.images[0];
    return typeof image === "string" ? image : image?.url || image?.path;
  }

  return item?.image || item?.imageUrl || item?.thumbnail;
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featuredResponse, categoriesResponse] = await Promise.all([getItems({ featured: true }), getCategories()]);
        setFeaturedItems(featuredResponse?.items || featuredResponse || []);
        setCategories(categoriesResponse?.categories || categoriesResponse || []);
      } catch {
        setError("We could not load the collection right now. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const leadItem = featuredItems[0];
  const secondaryItems = featuredItems.slice(1, 3);

  return (
    <>
      <Helmet>
        <title>Never The Twain | Timeless Pieces, Enduring Stories</title>
        <meta
          content="Discover elegant antiques, curated vintage furniture, and one-of-a-kind decorative pieces."
          name="description"
        />
      </Helmet>

      <section className="hero-grid relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(182,138,60,0.22),transparent_20%),radial-gradient(circle_at_88%_18%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(180deg,transparent,rgba(0,0,0,0.12))]" />
        <div className="absolute left-[-6rem] top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute right-[-5rem] top-10 h-80 w-80 rounded-full bg-[#b68a3c]/8 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-fade-in space-y-8">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">
                <span>Never The Twain</span>
                <span className="h-px w-10 bg-[#d6b57d]/40" />
                <span>Maynooth / Ireland</span>
              </div>

              <div className="space-y-6">
                <h1 className="max-w-5xl font-display text-[3.3rem] leading-[0.92] sm:text-[4.5rem] lg:text-[7rem]">
                  Decorative pieces for interiors that prefer memory over display.
                </h1>
                <div className="grid max-w-3xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <p className="text-lg leading-8 text-[#efe6d5]/82 sm:text-xl">
                    Never The Twain brings together antiques, curios, and quietly dramatic furnishings chosen for line, texture, and the kind of presence that improves a room rather than merely filling it.
                  </p>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Collector's view</p>
                    <p className="mt-3 text-sm leading-7 text-[#efe6d5]/78">
                      Fewer pieces, stronger character, and a collection paced more like an interior source book than a fast catalogue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link className="btn-primary" to="/shop">
                  View Collection
                </Link>
                <Link className="btn-secondary border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" to="/contact">
                  Arrange A Viewing
                </Link>
              </div>

              <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
                {[
                  { label: "Featured pieces", value: `${featuredItems.length || 0}+` },
                  { label: "Curated categories", value: `${categories.length || 0}` },
                  { label: "Private appointments", value: "Available" },
                ].map((stat) => (
                  <div className="rounded-[28px] border border-white/10 bg-black/10 px-5 py-5 backdrop-blur-sm" key={stat.label}>
                    <p className="font-display text-3xl text-[#f7f1e3]">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.26em] text-[#d7ccb8]/72">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 self-end lg:grid-cols-[0.78fr_0.22fr] xl:grid-cols-[0.82fr_0.18fr]">
              <div className="space-y-5">
                {leadItem && firstImage(leadItem) ? (
                  <div className="editorial-outline image-sheen animate-float relative overflow-hidden rounded-[40px] border border-white/10 bg-black/20 shadow-2xl shadow-black/20">
                    <img
                      alt={leadItem.title}
                      className="aspect-[0.95] w-full object-cover"
                      decoding="async"
                      fetchPriority="high"
                      src={buildImageUrl(firstImage(leadItem))}
                    />
                    <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/85 via-black/40 to-transparent px-6 pb-7 pt-20">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Featured piece</p>
                      <p className="mt-3 max-w-md font-display text-4xl leading-tight text-[#f4ecdf]">{leadItem.title}</p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <p className="text-sm uppercase tracking-[0.26em] text-[#efe6d5]/72">
                          {leadItem.price != null ? `EUR ${Number(leadItem.price).toLocaleString()}` : "Price on request"}
                        </p>
                        <Link className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm" to={`/shop/${leadItem._id || leadItem.id || leadItem.slug}`}>
                          View Piece
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="paper-panel editorial-card rounded-[32px] p-6">
                    <p className="eyebrow">Approach</p>
                    <p className="mt-4 text-base leading-8 text-[#4f574a]">
                      Furniture and objects chosen for proportion, wear, and the quiet authority they lend to a room.
                    </p>
                  </div>
                  <div className="editorial-card rounded-[32px] bg-[#2a3027]/88 p-6 text-[#f1e8d9]">
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Not trend-led</p>
                    <p className="mt-4 font-display text-3xl leading-tight">Collected to feel inherited rather than newly acquired.</p>
                  </div>
                </div>
              </div>

              <div className="hidden gap-4 lg:grid">
                {secondaryItems.map((item, index) =>
                  firstImage(item) ? (
                    <button
                      className="editorial-outline image-sheen overflow-hidden rounded-[28px] border border-white/10 bg-black/20 text-left shadow-soft"
                      key={item._id || item.id || index}
                      onClick={() => navigate(`/shop/${item._id || item.id || item.slug}`)}
                      type="button"
                    >
                      <img alt={item.title} className="aspect-[0.9] w-full object-cover" decoding="async" loading="lazy" src={buildImageUrl(firstImage(item))} />
                    </button>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2f382d]/10 bg-white/35">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 text-sm text-[#4f584b] sm:px-6 lg:grid-cols-[0.8fr_1.2fr_0.8fr] lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b68a3c]">Private collection house</p>
          <p className="text-center leading-7">Antiques, curios, and decorative furniture selected for texture, proportion, and the feeling of permanence.</p>
          <p className="text-right text-xs font-semibold uppercase tracking-[0.34em] text-[#44503d]">Viewings by appointment</p>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-5">
            <p className="eyebrow">Featured Collection</p>
            <h2 className="section-title">Standout pieces with enough presence to set the room around them</h2>
            <p className="max-w-md text-sm leading-8 text-[#5e5a50]">
              Larger furniture, sculptural decorative objects, and collector-led finds intended to anchor a room rather than simply fill it.
            </p>
          </div>

          <div className="paper-panel editorial-card rounded-[34px] p-8 shadow-soft">
            <div className="grid gap-5 text-sm leading-8 text-[#5d574b] sm:grid-cols-2">
              <p>Each piece is chosen for silhouette, surface, and how it will live with other objects rather than how loudly it performs on its own.</p>
              <p>That means fewer interchangeable items, more material character, and a catalogue that feels closer to a private source list than a fast shop.</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {loading ? <LoadingSpinner label="Loading featured pieces..." /> : null}
          {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

          {!loading && !error ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredItems.slice(0, 6).map((item) => (
                <ItemCard item={item} key={item._id || item.id} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#ece4d5]/70">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse By Category</p>
              <h2 className="section-title">Collected by material, mood, and decorative use</h2>
            </div>
          </div>

          {loading ? <LoadingSpinner label="Loading categories..." /> : null}

          {!loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category, index) => {
                const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, "-");
                return (
                  <button
                    className={`rounded-[32px] border px-6 py-10 text-left shadow-soft hover:-translate-y-1 ${
                      index % 3 === 0
                        ? "border-[#2f382d]/10 bg-[#232820] text-[#efe6d5]"
                        : "paper-panel border-[#2f382d]/10 bg-white/80 text-[#253022]"
                    }`}
                    key={category._id || category.id || slug}
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(slug)}`)}
                    type="button"
                  >
                    <p className={`text-xs font-semibold uppercase tracking-[0.32em] ${index % 3 === 0 ? "text-[#d8b579]" : "text-[#b68a3c]"}`}>Category</p>
                    <p className={`mt-5 font-display text-3xl leading-tight ${index % 3 === 0 ? "text-[#f7efe0]" : "text-[#263024]"}`}>{category.name}</p>
                    <p className={`mt-4 text-sm leading-7 ${index % 3 === 0 ? "text-[#efe6d5]/74" : "text-[#636055]"}`}>
                      Explore pieces that share a common material language, decorative rhythm, or historical atmosphere.
                    </p>
                    <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.28em] ${index % 3 === 0 ? "text-[#d8b579]" : "text-[#44503d]"}`}>
                      Explore collection
                    </p>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
