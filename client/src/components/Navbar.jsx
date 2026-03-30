import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Collection" },
  { to: "/contact", label: "Appointments" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 py-4 backdrop-blur-xl ${
          scrolled ? "border-white/10 bg-[#161814]/90 shadow-2xl shadow-black/10" : "border-[#2f382d]/10 bg-[#f5efe4]/88 shadow-soft"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`relative hidden h-11 w-11 items-center justify-center rounded-full border md:flex ${
              scrolled ? "border-white/12 bg-white/[0.03] text-[#efe6d5]" : "border-[#2f382d]/12 bg-white/55 text-[#2f382d]"
            }`}
          >
            <span
              className={`pointer-events-none absolute inset-[4px] rounded-full border ${
                scrolled ? "border-white/10" : "border-[#2f382d]/10"
              }`}
            />
            <span className="relative font-display text-[0.72rem] tracking-[0.18em]">TAC</span>
          </div>
          <div className="flex flex-col">
            <Link className={`font-display text-2xl tracking-[0.08em] ${scrolled ? "text-[#f0e8d8]" : "text-[#2b3427]"}`} to="/">
              Twain Antiques & Curios
            </Link>
            <span className={`hidden text-[10px] font-semibold uppercase tracking-[0.34em] md:block ${scrolled ? "text-[#d8ccb6]/70" : "text-[#6a6457]"}`}>
              Curiosities Collected From the Edge of Time
            </span>
          </div>
        </div>

        <button
          aria-label="Toggle menu"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border md:hidden ${
            scrolled ? "border-white/15 text-[#f0e8d8]" : "border-[#2f382d]/15 text-[#2b3427]"
          }`}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>

        <nav className="hidden items-center gap-3 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] ${
                  isActive
                    ? scrolled
                      ? "bg-white/10 text-white"
                      : "bg-[#2b3427] text-[#f4ede1]"
                    : scrolled
                      ? "text-[#d9ccb3] hover:bg-white/5 hover:text-white"
                      : "text-[#5b6455] hover:bg-[#2b3427]/5 hover:text-[#2b3427]"
                }`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {open ? (
        <nav className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-[#2f382d]/10 bg-[#f5efe4]/95 p-3 shadow-soft md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] ${
                    isActive ? "bg-[#2b3427] text-[#f4ede1]" : "text-[#475141] hover:bg-[#2b3427]/5"
                  }`
                }
                onClick={() => setOpen(false)}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
