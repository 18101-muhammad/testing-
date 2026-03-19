import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#171914] text-[#efe6d5]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#b68a3c]">Private Collection House</p>
          <h2 className="font-display text-4xl text-[#f3ecdf]">Never The Twain</h2>
          <p className="max-w-2xl text-sm leading-8 text-[#efe6d5]/72">
            An online collection of decorative antiques, singular furniture, and quietly dramatic objects chosen for rooms that value memory, patina, and restraint.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b68a3c]">Explore</h3>
            <div className="flex flex-col gap-3 text-sm text-[#efe6d5]/78">
              <Link className="hover:text-white" to="/">
                Home
              </Link>
              <Link className="hover:text-white" to="/shop">
                Collection
              </Link>
              <Link className="hover:text-white" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b68a3c]">Visit</h3>
            <div className="space-y-2 text-sm text-[#efe6d5]/78">
              <p>Maynooth, Ireland</p>
              <p>Private viewings by appointment</p>
              <p>Monday to Saturday, 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs uppercase tracking-[0.24em] text-[#efe6d5]/50 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>Never The Twain</span>
          <span>Collected with patience</span>
        </div>
      </div>
    </footer>
  );
}
