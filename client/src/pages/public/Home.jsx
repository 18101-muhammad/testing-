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
        const [featuredResponse, categoriesResponse] = await Promise.all([
          getItems({ featured: true }),
          getCategories(),
        ]);

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
        <title>The Antique Room | Timeless Pieces, Enduring Stories</title>
        <meta
          content="Discover elegant antiques, curated vintage furniture, and one-of-a-kind decorative pieces."
          name="description"
        />
      </Helmet>

      <section className="hero-grid relative isolate overflow-hidden bg-antique-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.22),_transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl animate-fade-in space-y-8">
            <span className="inline-flex rounded-full border border-antique-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-antique-gold">
              Curated Fine Antiques
            </span>
            <div className="space-y-4">
              <h1 className="font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
                Timeless Pieces, Enduring Stories
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-antique-cream/85 sm:text-xl">
                Discover rare and beautiful antiques curated with care.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link className="btn-primary" to="/shop">
                Browse Collection
              </Link>
              <Link className="btn-secondary border-white/20 text-white hover:bg-white/10 hover:text-white" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Collection</p>
            <h2 className="section-title">Featured Pieces</h2>
          </div>
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

      <section className="bg-white">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse By Category</p>
              <h2 className="section-title">Elegant Finds For Every Interior</h2>
            </div>
          </div>

          {loading ? <LoadingSpinner label="Loading categories..." /> : null}

          {!loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => {
                const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, "-");
                return (
                  <button
                    className="group rounded-[28px] border border-antique-gold/20 bg-antique-light-gold px-6 py-10 text-left hover:-translate-y-1 hover:bg-antique-navy hover:text-white"
                    key={category._id || category.id || slug}
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(slug)}`)}
                    type="button"
                  >
                    <p className="font-display text-3xl text-antique-navy group-hover:text-antique-gold">
                      {category.name}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-antique-muted group-hover:text-white/80">
                      Explore handcrafted objects and timeless decorative pieces within this collection.
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
