import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 overflow-hidden bg-[#171914] text-[#efe6d5]">
      <div className="border-b border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#b68a3c]">Private Collection House</p>
            <h2 className="font-display text-5xl leading-none text-[#f3ecdf]">Never The Twain</h2>
          </div>
          <p className="max-w-2xl text-sm leading-8 text-[#efe6d5]/70">
            Decorative antiques and quietly dramatic pieces chosen for homes that want atmosphere, line, and memory rather than noise.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-5">
          <p className="max-w-2xl text-sm leading-8 text-[#efe6d5]/72">
            An online collection of decorative antiques, singular furniture, and quietly dramatic objects chosen for rooms that value memory, patina, and restraint.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b68a3c]">Location</p>
              <p className="mt-2 text-sm text-[#efe6d5]">Maynooth, Ireland</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b68a3c]">Viewings</p>
              <p className="mt-2 text-sm text-[#efe6d5]">By appointment</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b68a3c]">Hours</p>
              <p className="mt-2 text-sm text-[#efe6d5]">Mon to Sat</p>
            </div>
          </div>
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
