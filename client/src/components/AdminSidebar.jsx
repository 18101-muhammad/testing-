import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/items", label: "Items" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin Panel</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Twain Antiques & Curios</h2>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-semibold ${
                isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`
            }
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        className="mt-8 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        onClick={logout}
        type="button"
      >
        Logout
      </button>
    </aside>
  );
}
