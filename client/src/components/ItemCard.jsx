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
  const imageUrl = buildImageUrl(firstImage(item));

  return (
    <Link
      className="group editorial-card overflow-hidden shadow-soft hover:-translate-y-1 hover:shadow-2xl"
      to={`/shop/${item._id || item.id || item.slug}`}
    >
      <div className="image-sheen relative aspect-[4/3] overflow-hidden bg-[#e8dfce]">
        <img alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" src={imageUrl} />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-95" />
        <div className="absolute left-4 top-4 z-[2] rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm">
          Curated Piece
        </div>
        {item.sold ? (
          <span className="absolute right-4 top-4 z-[2] rounded-full bg-[#5c2f2b] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
            Sold
          </span>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4 z-[2] flex items-end justify-between gap-4">
          <div className="max-w-[70%]">
            {item.category_name || item.category?.name ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                {item.category_name || item.category?.name}
              </p>
            ) : null}
            <p className="mt-2 font-display text-2xl leading-tight text-white">{item.title}</p>
          </div>
          <span className="rounded-full border border-white/18 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
            View
          </span>
        </div>
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
