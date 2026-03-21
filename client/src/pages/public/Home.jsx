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
  const secondaryItems = featuredItems.slice(1, 4);

  return (
    <>
      <Helmet>
        <title>Twain Antiques & Curios | Collected Objects For Rooms With Memory</title>
        <meta
          content="Discover antiques, curios, and decorative objects chosen for atmosphere, proportion, and quiet character."
          name="description"
        />
      </Helmet>

      <section className="hero-grid relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(182,138,60,0.18),transparent_20%),linear-gradient(180deg,transparent,rgba(0,0,0,0.08))]" />
        <div className="absolute inset-y-0 right-0 hidden w-[42%] border-l border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-20 lg:pt-20">
          <div className="animate-fade-in space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Twain Antiques & Curios / Maynooth</p>
              <h1 className="max-w-4xl font-display text-4xl leading-[0.95] sm:text-5xl lg:text-[5.2rem]">
                Collected Objects For Rooms With Memory
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#efe6d5]/80 sm:text-lg">
                Antiques, curios, and decorative pieces selected for tone, proportion, and the kind of presence that settles a room.
              </p>
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
                <div className="rounded-[24px] border border-white/10 bg-black/10 px-5 py-4 backdrop-blur-sm" key={stat.label}>
                  <p className="font-display text-2xl text-[#f7f1e3]">{stat.value}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[#d7ccb8]/72">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-delayed grid gap-4 self-end">
            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d6b57d]">Collection Note</p>
              <p className="mt-4 font-display text-3xl leading-tight text-[#f4ecdf]">
                Fewer pieces. Better character. A quieter collection built for atmosphere rather than volume.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-black/12 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d6b57d]">Approach</p>
                <p className="mt-3 text-sm leading-7 text-[#efe6d5]/76">
                  Decorative antiques, singular furniture, and objects chosen to sit well with one another over time.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-black/12 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d6b57d]">Viewings</p>
                <p className="mt-3 text-sm leading-7 text-[#efe6d5]/76">
                  Private appointments in Maynooth for collectors, decorators, and slower rooms in progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2f382d]/10 bg-white/35">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 text-sm text-[#4f584b] sm:px-6 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b68a3c]">Private collection house</p>
          <p className="text-center leading-7">Antiques, curios, and decorative furniture selected for texture, proportion, and permanence.</p>
          <p className="text-right text-xs font-semibold uppercase tracking-[0.34em] text-[#44503d]">Viewings by appointment</p>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5 xl:pt-6">
            <p className="eyebrow">Featured Collection</p>
            <h2 className="section-title">Featured pieces with presence, texture, and restraint</h2>
            <p className="max-w-md text-sm leading-8 text-[#5e5a50]">
              A small selection of pieces chosen to give the collection its tone: sculptural, decorative, and quietly distinctive.
            </p>
            <div className="rounded-[28px] border border-[#2f382d]/10 bg-white/55 p-5 text-sm leading-7 text-[#5b564a] shadow-soft">
              The front page is not the whole stockroom. It is a tighter edit of pieces that best express the collection.
            </div>
          </div>

          <div className="space-y-6">
            {loading ? <LoadingSpinner label="Loading featured pieces..." /> : null}
            {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

            {!loading && !error && leadItem ? (
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <Link
                  className="group editorial-card paper-panel overflow-hidden rounded-[34px] shadow-soft"
                  to={`/shop/${leadItem._id || leadItem.id || leadItem.slug}`}
                >
                  <div className="image-sheen relative aspect-[4/3] overflow-hidden bg-[#e8dfce]">
                    <img
                      alt={leadItem.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      decoding="async"
                      fetchPriority="high"
                      src={buildImageUrl(firstImage(leadItem))}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute left-5 top-5 z-[2] rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm">
                      Lead Piece
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 z-[2]">
                      {leadItem.category_name || leadItem.category?.name ? (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/72">
                          {leadItem.category_name || leadItem.category?.name}
                        </p>
                      ) : null}
                      <h3 className="mt-2 max-w-xl font-display text-4xl leading-tight text-white">{leadItem.title}</h3>
                    </div>
                  </div>

                  <div className="grid gap-5 p-7 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#71695c]">
                        {leadItem.era ? <span>{leadItem.era}</span> : null}
                        {leadItem.condition ? <span>{leadItem.condition}</span> : null}
                      </div>
                      <p className="max-w-xl text-sm leading-8 text-[#5d584d]">
                        {leadItem.description}
                      </p>
                    </div>
                    <div className="space-y-3 md:text-right">
                      <p className="font-display text-3xl text-[#b68a3c]">
                        {leadItem.price != null ? `EUR ${Number(leadItem.price).toLocaleString()}` : "Price on request"}
                      </p>
                      <span className="inline-flex rounded-full border border-[#2f382d]/12 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#364032]">
                        View piece
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {secondaryItems.map((item) => (
                    <ItemCard item={item} key={item._id || item.id} />
                  ))}
                </div>
              </div>
            ) : null}

            {!loading && !error && !leadItem ? (
              <div className="paper-panel editorial-card rounded-[32px] p-10 shadow-soft">
                <p className="text-sm text-[#5d584d]">No featured pieces are available right now.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-[#ece4d5]/70">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse By Category</p>
              <h2 className="section-title">Browse by category, material language, and decorative mood</h2>
            </div>
          </div>

          {loading ? <LoadingSpinner label="Loading categories..." /> : null}

          {!loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category, index) => {
                const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, "-");
                return (
                  <button
                    className={`rounded-[30px] border px-6 py-8 text-left shadow-soft hover:-translate-y-1 ${
                      index % 3 === 0
                        ? "border-[#2f382d]/10 bg-[#232820] text-[#efe6d5]"
                        : "paper-panel border-[#2f382d]/10 bg-white/80 text-[#253022]"
                    }`}
                    key={category._id || category.id || slug}
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(slug)}`)}
                    type="button"
                  >
                    <p className={`text-xs font-semibold uppercase tracking-[0.32em] ${index % 3 === 0 ? "text-[#d8b579]" : "text-[#b68a3c]"}`}>Category</p>
                    <p className={`mt-4 font-display text-3xl leading-tight ${index % 3 === 0 ? "text-[#f7efe0]" : "text-[#263024]"}`}>{category.name}</p>
                    <p className={`mt-4 text-sm leading-7 ${index % 3 === 0 ? "text-[#efe6d5]/74" : "text-[#636055]"}`}>
                      Explore pieces that share a common material language and decorative atmosphere.
                    </p>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-shell pt-16">
        <div className="grid gap-6 rounded-[36px] bg-[#20241d] px-6 py-10 text-[#efe6d5] shadow-soft sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Private Viewings</p>
            <h2 className="font-display text-4xl leading-tight text-[#f6eedf] sm:text-5xl">
              Some pieces need room, scale, and natural light before they make sense.
            </h2>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <p className="max-w-xl text-sm leading-8 text-[#efe6d5]/74">
              If you are buying for a house in progress, a single room, or a more considered interior, arrange a viewing and we will keep the conversation specific.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" to="/contact">
                Arrange A Viewing
              </Link>
              <Link className="btn-secondary border-white/12 bg-white/5 text-white hover:bg-white/10 hover:text-white" to="/shop">
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
