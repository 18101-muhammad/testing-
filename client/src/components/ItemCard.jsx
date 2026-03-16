import { Link } from "react-router-dom";
import { buildImageUrl } from "../api/api";

const firstImage = (item) => {
  if (Array.isArray(item?.images) && item.images.length) {
    const image = item.images[0];
    return typeof image === "string" ? image : image?.url || image?.path;
  }

  return item?.image || item?.imageUrl || item?.thumbnail;
};

export default function ItemCard({ item }) {
  return (
    <Link
      className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft hover:-translate-y-1 hover:shadow-2xl"
      to={`/shop/${item._id || item.id || item.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-antique-light-gold">
        <img
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          src={buildImageUrl(firstImage(item))}
        />
        {item.sold ? (
          <span className="absolute left-4 top-4 rounded-full bg-red-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            SOLD
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-antique-navy">{item.title}</h3>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-antique-muted">
            {item.era ? <span className="rounded-full bg-antique-light-gold px-3 py-1">{item.era}</span> : null}
            {item.condition ? <span className="rounded-full bg-slate-100 px-3 py-1">{item.condition}</span> : null}
          </div>
        </div>

        <p className="text-2xl font-bold text-antique-gold">
          {item.price != null ? `€${Number(item.price).toLocaleString()}` : "Price on request"}
        </p>
      </div>
    </Link>
  );
}
