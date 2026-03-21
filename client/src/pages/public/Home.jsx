import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, getItems } from "../../api/api";
import ItemCard from "../../components/ItemCard";
import LoadingSpinner from "../../components/LoadingSpinner";

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
        <title>Twain Antiques & Curios | Collected Objects For Rooms With Memory</title>
        <meta
          content="Discover antiques, curios, and decorative objects chosen for atmosphere, proportion, and quiet character."
          name="description"
        />
      </Helmet>

      <section className="hero-grid relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(182,138,60,0.18),transparent_20%),linear-gradient(180deg,transparent,rgba(0,0,0,0.08))]" />

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="animate-fade-in space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Twain Antiques & Curios / Maynooth</p>
            <h1 className="mx-auto max-w-4xl font-display text-4xl leading-[1] sm:text-5xl lg:text-6xl">
              Collected Objects For Rooms With Memory
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-[#efe6d5]/80 sm:text-lg">
              Antiques, curios, and decorative pieces selected for tone, proportion, and the kind of presence that settles a room.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link className="btn-primary" to="/shop">
                View Collection
              </Link>
              <Link className="btn-secondary border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" to="/contact">
                Arrange A Viewing
              </Link>
            </div>

            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
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
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Featured Collection</p>
            <h2 className="section-title">Featured pieces with presence, texture, and restraint</h2>
            <p className="max-w-md text-sm leading-8 text-[#5e5a50]">
              A small selection of pieces chosen to give the collection its tone: sculptural, decorative, and quietly distinctive.
            </p>
          </div>

          <div className="paper-panel editorial-card rounded-[32px] p-6 shadow-soft">
            {loading ? <LoadingSpinner label="Loading featured pieces..." /> : null}
            {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

            {!loading && !error ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {featuredItems.slice(0, 4).map((item) => (
                  <ItemCard item={item} key={item._id || item.id} />
                ))}
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
    </>
  );
}
