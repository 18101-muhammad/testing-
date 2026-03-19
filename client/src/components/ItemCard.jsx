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
      className="group editorial-card overflow-hidden shadow-soft hover:-translate-y-1 hover:shadow-2xl"
      to={`/shop/${item._id || item.id || item.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8dfce]">
        <img alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" src={buildImageUrl(firstImage(item))} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent opacity-80" />
        {item.sold ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#5c2f2b] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
            Sold
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#71695c]">
            {item.era ? <span>{item.era}</span> : null}
            {item.condition ? <span>{item.condition}</span> : null}
          </div>
          <h3 className="font-display text-[1.9rem] leading-tight text-[#263024]">{item.title}</h3>
        </div>

        <div className="flex items-center justify-between border-t border-[#2f382d]/10 pt-4">
          <p className="text-2xl font-semibold text-[#b68a3c]">{item.price != null ? `EUR ${Number(item.price).toLocaleString()}` : "Price on request"}</p>
          <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[#44503d]">View piece</span>
        </div>
      </div>
    </Link>
  );
}
