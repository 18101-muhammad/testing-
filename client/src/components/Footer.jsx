import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-antique-navy text-antique-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <h2 className="font-display text-3xl text-antique-gold">The Antique Room</h2>
          <p className="max-w-xl text-sm leading-7 text-antique-cream/80">
            Rare furniture, decorative treasures, and storied objects chosen for collectors who value craftsmanship and provenance.
          </p>
          <p className="text-sm uppercase tracking-[0.28em] text-antique-gold/80">
            Est. 2024 - Passionate about preserving history
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-antique-gold">Explore</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link className="hover:text-antique-gold" to="/">
              Home
            </Link>
            <Link className="hover:text-antique-gold" to="/shop">
              Shop
            </Link>
            <Link className="hover:text-antique-gold" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl justify-between px-4 py-4 text-xs text-antique-cream/70 sm:px-6 lg:px-8">
          <span>All rights reserved.</span>
          <span>The Antique Room</span>
        </div>
      </div>
    </footer>
  );
}
