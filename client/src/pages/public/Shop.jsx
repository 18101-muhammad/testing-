import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { getCategories, getItems } from "../../api/api";
import ItemCard from "../../components/ItemCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const emptyFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...emptyFilters,
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((response) => setCategories(response?.categories || response || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getItems(searchParams.size ? Object.fromEntries(searchParams.entries()) : {});
        setItems(response?.items || response || []);
      } catch {
        setError("We could not load the collection right now. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    const nextParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        nextParams[key] = value;
      }
    });
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Shop | Never The Twain</title>
      </Helmet>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse The Collection</p>
            <h1 className="section-title">Our Collection</h1>
          </div>
          <p className="text-sm text-antique-muted">Showing {items.length} items</p>
        </div>

        <form className="rounded-[32px] border border-antique-gold/20 bg-white p-6 shadow-soft" onSubmit={applyFilters}>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <input
              className="form-input"
              name="search"
              onChange={handleChange}
              placeholder="Search by title, era, or keyword"
              value={filters.search}
            />
            <select className="form-input" name="category" onChange={handleChange} value={filters.category}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id || category.id} value={category.slug || category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <input className="form-input" min="0" name="minPrice" onChange={handleChange} placeholder="Min price" type="number" value={filters.minPrice} />
            <input className="form-input" min="0" name="maxPrice" onChange={handleChange} placeholder="Max price" type="number" value={filters.maxPrice} />
            <div className="flex gap-3">
              <button className="btn-primary flex-1 justify-center" type="submit">
                Filter
              </button>
              <button className="btn-secondary flex-1 justify-center" onClick={clearFilters} type="button">
                Clear
              </button>
            </div>
          </div>
        </form>

        {loading ? <LoadingSpinner label="Loading collection..." /> : null}
        {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

        {!loading && !error && !items.length ? (
          <div className="rounded-[32px] border border-dashed border-antique-gold/40 bg-white p-10 text-center">
            <h2 className="font-display text-3xl text-antique-navy">No items found</h2>
            <p className="mt-3 text-antique-muted">Try broadening your filters or browse the full collection.</p>
          </div>
        ) : null}

        {!loading && !error && items.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ItemCard item={item} key={item._id || item.id} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
