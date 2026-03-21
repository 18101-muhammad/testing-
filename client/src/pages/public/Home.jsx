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

  const leadItem = featuredItems[0];
  const supportingItems = featuredItems.slice(1, 5);

  return (
    <>
      <Helmet>
        <title>Twain Antiques & Curios | Curiosities Collected From the Edge of Time</title>
        <meta
          content="Discover elegant antiques, curated vintage furniture, and one-of-a-kind decorative pieces."
          name="description"
        />
      </Helmet>

      <section className="hero-grid relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(182,138,60,0.16),transparent_18%),radial-gradient(circle_at_84%_14%,rgba(255,255,255,0.06),transparent_20%)]" />
        <div className="absolute left-[7%] top-[18%] hidden h-28 w-28 rounded-full border border-white/10 lg:block" />
        <div className="absolute bottom-[16%] right-[10%] hidden h-40 w-40 rounded-full border border-[#d6b57d]/18 lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 pb-18 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-fade-in space-y-8">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">
                <span>Twain Antiques & Curios</span>
                <span className="h-px w-10 bg-[#d6b57d]/35" />
                <span>Maynooth</span>
                <span className="h-px w-10 bg-[#d6b57d]/35" />
                <span>Private Collection House</span>
              </div>

              <div className="space-y-6">
                <h1 className="max-w-5xl font-display text-5xl leading-[0.92] sm:text-6xl lg:text-[6.4rem]">
                  Curiosities Collected From the Edge of Time
                </h1>
                <div className="grid max-w-3xl gap-6 md:grid-cols-[1.35fr_0.65fr]">
                  <p className="text-base leading-8 text-[#efe6d5]/80 sm:text-lg">
                    A slower collection of antiques, curios, and quietly striking furnishings chosen for proportion, texture, and lasting atmosphere.
                  </p>
                  <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-5 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d6b57d]">Collector's note</p>
                    <p className="mt-3 text-sm leading-7 text-[#efe6d5]/72">
                      Fewer pieces, more conviction, and a collection designed to feel considered rather than crowded.
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
            </div>

            <div className="grid gap-4 self-end md:grid-cols-3 xl:grid-cols-1">
              {[
                { label: "Featured pieces", value: `${featuredItems.length || 0}+` },
                { label: "Curated categories", value: `${categories.length || 0}` },
                { label: "Private appointments", value: "Available" },
              ].map((stat, index) => (
                <div
                  className={`rounded-[30px] border px-6 py-6 backdrop-blur-sm ${
                    index === 1 ? "bg-[#f1e9db] text-[#20251d] border-[#f1e9db]/50" : "border-white/10 bg-black/10 text-white"
                  }`}
                  key={stat.label}
                >
                  <p className={`font-display text-4xl ${index === 1 ? "text-[#20251d]" : "text-[#f7f1e3]"}`}>{stat.value}</p>
                  <p className={`mt-2 text-[11px] uppercase tracking-[0.24em] ${index === 1 ? "text-[#615b4e]" : "text-[#d7ccb8]/72"}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2f382d]/10 bg-white/35">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 text-sm text-[#4f584b] sm:px-6 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b68a3c]">Collected with patience</p>
          <p className="text-center leading-7">Antiques and decorative pieces selected for permanence, atmosphere, and how they live with a room over time.</p>
          <p className="text-right text-xs font-semibold uppercase tracking-[0.34em] text-[#44503d]">By appointment in Maynooth</p>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Collection</p>
            <h2 className="section-title">Collected pieces with enough presence to set the room around them</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#5e5a50]">
            The front page stays restrained. The imagery belongs here, where the pieces themselves should carry the atmosphere.
          </p>
        </div>

        {loading ? <LoadingSpinner label="Loading featured pieces..." /> : null}
        {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

        {!loading && !error && featuredItems.length ? (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="min-h-full">
              <ItemCard item={leadItem} key={leadItem?._id || leadItem?.id || "lead"} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {supportingItems.map((item) => (
                <ItemCard item={item} key={item._id || item.id} />
              ))}
            </div>
          </div>
        ) : null}
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
