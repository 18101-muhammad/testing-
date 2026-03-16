import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminCategories, getAdminItems, getEnquiries } from "../../api/api";
import AdminShell from "../../components/AdminShell";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ items: 0, categories: 0, unreadEnquiries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [itemsResponse, categoriesResponse, enquiriesResponse] = await Promise.all([
          getAdminItems({}, token),
          getAdminCategories(token),
          getEnquiries(token),
        ]);

        const items = itemsResponse?.items || itemsResponse || [];
        const categories = categoriesResponse?.categories || categoriesResponse || [];
        const enquiries = enquiriesResponse?.enquiries || enquiriesResponse || [];

        setStats({
          items: items.length,
          categories: categories.length,
          unreadEnquiries: enquiries.filter((entry) => !entry.read).length,
        });
      } catch {
        setError("Dashboard statistics are unavailable right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <AdminShell
      actions={
        <>
          <Link className="admin-button inline-flex w-auto" to="/admin/items/new">
            Add New Item
          </Link>
          <Link className="admin-button-secondary inline-flex w-auto" to="/admin/enquiries">
            View Enquiries
          </Link>
        </>
      }
      title="Admin Dashboard"
    >
      {loading ? <LoadingSpinner label="Loading dashboard..." /> : null}
      {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Total Items", value: stats.items },
            { label: "Total Categories", value: stats.categories },
            { label: "Unread Enquiries", value: stats.unreadEnquiries },
          ].map((card) => (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft" key={card.label}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
              <p className="mt-6 text-5xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </AdminShell>
  );
}
