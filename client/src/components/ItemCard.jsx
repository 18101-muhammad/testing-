import { Link } from "react-router-dom";
import { buildImageUrl } from "../api/api";

const firstImage = (item) => {
  if (Array.isArray(item?.images) && item.images.length) {
    const image = item.images[0];
    return typeof image === "string" ? image : image?.url || image?.path;
  }

  return item?.image || item?.imageUrl || item?.thumbnail;
};

export default function ItemCard({ item, eager = false }) {
  const imageUrl = buildImageUrl(firstImage(item));

  return (
    <Link
      className="group editorial-card overflow-hidden shadow-soft hover:-translate-y-1 hover:shadow-2xl"
      to={`/shop/${item._id || item.id || item.slug}`}
    >
      <div className="image-sheen relative aspect-[4/3] overflow-hidden bg-[#e8dfce]">
        <img
          alt={item.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          loading={eager ? "eager" : "lazy"}
          src={imageUrl}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-95" />
        <div className="absolute left-3 top-3 z-[2] rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] sm:tracking-[0.28em]">
          Curated Piece
        </div>
        {item.sold ? (
          <span className="absolute right-3 top-3 z-[2] rounded-full bg-[#5c2f2b] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white sm:right-4 sm:top-4 sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
            Sold
          </span>
        ) : null}
        <div className="absolute bottom-3 left-3 right-3 z-[2] flex items-end justify-between gap-3 sm:bottom-4 sm:left-4 sm:right-4 sm:gap-4">
          <div className="max-w-[72%]">
            {item.category_name || item.category?.name ? (
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-[10px] sm:tracking-[0.28em]">
                {item.category_name || item.category?.name}
              </p>
            ) : null}
            <p className="mt-1.5 font-display text-xl leading-tight text-white sm:mt-2 sm:text-2xl">{item.title}</p>
          </div>
          <span className="rounded-full border border-white/18 bg-white/10 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:px-3 sm:py-2 sm:text-[10px] sm:tracking-[0.24em]">
            View
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71695c] sm:text-[11px] sm:tracking-[0.24em]">
            {item.era ? <span>{item.era}</span> : null}
            {item.condition ? <span>{item.condition}</span> : null}
          </div>
          <h3 className="font-display text-[1.55rem] leading-tight text-[#263024] sm:text-[1.9rem]">{item.title}</h3>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#2f382d]/10 pt-4">
          <p className="text-xl font-semibold text-[#b68a3c] sm:text-2xl">{item.price != null ? `EUR ${Number(item.price).toLocaleString()}` : "Price on request"}</p>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#44503d] sm:text-xs sm:tracking-[0.26em]">View piece</span>
        </div>
      </div>
    </Link>
  );
}
