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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(182,138,60,0.24),transparent_24%)]" />
        <div className="absolute left-[-10%] top-24 h-64 w-64 rounded-full bg-[#b68a3c]/10 blur-3xl" />
        <div className="absolute bottom-[-5rem] right-[8%] h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-28 lg:pt-28">
          <div className="animate-fade-in space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b57d]">Collected Interiors • Ireland</p>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl lg:text-8xl">
                Rooms remember more when every object has a past.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#efe6d5]/80 sm:text-xl">
                Never The Twain brings together antiques, curios, and quietly striking furnishings selected for homes that prefer atmosphere over excess.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link className="btn-primary" to="/shop">
                View Collection
              </Link>
              <Link className="btn-secondary border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" to="/contact">
                Book A Viewing
              </Link>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                { label: "Collected pieces", value: `${featuredItems.length || 0}+` },
                { label: "Curated categories", value: `${categories.length || 0}` },
                { label: "Private appointments", value: "By request" },
              ].map((stat) => (
                <div className="animate-fade-in-delayed rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm" key={stat.label}>
                  <p className="font-display text-3xl text-[#f7f1e3]">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.26em] text-[#d7ccb8]/72">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 self-end">
            {featuredItems[0] && firstImage(featuredItems[0]) ? (
              <div className="editorial-outline image-sheen animate-float relative overflow-hidden rounded-[38px] border border-white/10 bg-black/20 shadow-2xl shadow-black/20">
                <img
                  alt={featuredItems[0].title}
                  className="aspect-[0.9] w-full object-cover"
                  decoding="async"
                  fetchPriority="high"
                  src={buildImageUrl(firstImage(featuredItems[0]))}
                />
                <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/80 via-black/35 to-transparent px-6 pb-7 pt-16">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Featured Interior Anchor</p>
                  <p className="mt-3 font-display text-3xl leading-tight text-[#f4ecdf]">{featuredItems[0].title}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.26em] text-[#efe6d5]/72">
                    {featuredItems[0].price != null ? `EUR ${Number(featuredItems[0].price).toLocaleString()}` : "Price on request"}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="paper-panel editorial-card animate-float-delayed rounded-[34px] p-6 text-[#20251d]">
                <p className="eyebrow">Approach</p>
                <p className="mt-4 text-lg leading-8 text-[#4f574a]">
                  A slower collection of furniture and decorative objects chosen for line, mood, wear, and the kind of presence that improves with age.
                </p>
              </div>
              <div className="editorial-card rounded-[34px] bg-[#2a3027]/84 p-6 text-[#f1e8d9]">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">For interiors with restraint</p>
                <p className="mt-4 font-display text-3xl leading-tight">Decorative pieces that feel inherited rather than merely bought.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2f382d]/10 bg-white/35">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 text-sm text-[#4f584b] sm:px-6 lg:grid-cols-[0.8fr_1.2fr_0.8fr] lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b68a3c]">Never The Twain</p>
          <p className="text-center leading-7">Antiques, curios, and decorative furniture selected for texture, proportion, and the feeling of permanence.</p>
          <p className="text-right text-xs font-semibold uppercase tracking-[0.34em] text-[#44503d]">Private viewings in Maynooth</p>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Collection</p>
            <h2 className="section-title">A considered selection of standout pieces</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#5e5a50]">
            Larger furniture, sculptural decorative objects, and collector-led finds intended to anchor a room rather than simply fill it.
          </p>
        </div>

        {loading ? <LoadingSpinner label="Loading featured pieces..." /> : null}
        {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

        {!loading && !error ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredItems.slice(0, 6).map((item) => (
              <ItemCard item={item} key={item._id || item.id} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="section-shell pt-0">
        <div className="paper-panel editorial-card grid gap-6 rounded-[34px] p-8 shadow-soft lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Collector's Note</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[#263024]">The collection is built for rooms that want gravity, not clutter.</h2>
          </div>
          <div className="grid gap-5 text-sm leading-8 text-[#5d574b] sm:grid-cols-2">
            <p>Each piece is chosen for silhouette, surface, and how it will live with other objects rather than how loudly it performs on its own.</p>
            <p>That means fewer interchangeable items, more material character, and a catalogue that feels closer to a private source list than a fast shop.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#ece4d5]/70">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse By Category</p>
              <h2 className="section-title">Collected by material, mood, and use</h2>
            </div>
          </div>

          {loading ? <LoadingSpinner label="Loading categories..." /> : null}

          {!loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category, index) => {
                const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, "-");
                return (
                  <button
                    className={`rounded-[30px] border px-6 py-10 text-left shadow-soft hover:-translate-y-1 ${
                      index % 3 === 0
                        ? "border-[#2f382d]/10 bg-[#232820] text-[#efe6d5]"
                        : "border-[#2f382d]/10 bg-white/80 text-[#253022]"
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
