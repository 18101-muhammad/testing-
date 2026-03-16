import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buildImageUrl, deleteItem, getAdminItems, updateItem } from "../../api/api";
import AdminShell from "../../components/AdminShell";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

const imageFromItem = (item) => {
  const first = Array.isArray(item.images) ? item.images[0] : null;
  return typeof first === "string" ? first : first?.url || first?.path || item.image || item.imageUrl;
};

const buildItemFormData = (item, overrides = {}) => {
  const payload = { ...item, ...overrides };
  const formData = new FormData();

  ["title", "description", "price", "category", "era", "condition", "featured", "sold"].forEach((field) => {
    let value = payload[field];

    if (field === "category" && value && typeof value === "object") {
      value = value._id || value.id || value.name || "";
    }

    if (typeof value === "boolean") {
      value = String(value);
    }

    if (value != null) {
      formData.append(field, value);
    }
  });

  return formData;
};

export default function AdminItems() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminItems({}, token);
        setItems(response?.items || response || []);
      } catch {
        setError("Items could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [token]);

  const filteredItems = useMemo(() => {
    if (!search) {
      return items;
    }

    return items.filter((item) => item.title?.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) {
      return;
    }

    try {
      await deleteItem(id, token);
      setItems((current) => current.filter((item) => (item._id || item.id) !== id));
    } catch {
      setError("This item could not be deleted.");
    }
  };

  const handleToggle = async (item, field) => {
    try {
      const formData = buildItemFormData(item, { [field]: !item[field] });
      const updated = await updateItem(item._id || item.id, formData, token);
      const updatedItem = updated?.item || updated;
      setItems((current) =>
        current.map((entry) => ((entry._id || entry.id) === (item._id || item.id) ? { ...entry, ...updatedItem } : entry))
      );
    } catch {
      setError(`The ${field} status could not be updated.`);
    }
  };

  return (
    <AdminShell
      actions={
        <Link className="admin-button inline-flex w-auto" to="/admin/items/new">
          Add New Item
        </Link>
      }
      title="Items"
    >
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <input className="admin-input" onChange={(event) => setSearch(event.target.value)} placeholder="Search items" value={search} />
      </div>

      {loading ? <LoadingSpinner label="Loading items..." /> : null}
      {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

      {!loading ? (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">Item</th>
                  <th className="px-4 py-4 font-semibold">Price</th>
                  <th className="px-4 py-4 font-semibold">Category</th>
                  <th className="px-4 py-4 font-semibold">Sold</th>
                  <th className="px-4 py-4 font-semibold">Featured</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const id = item._id || item.id;
                  return (
                    <tr className="border-t border-slate-100" key={id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img alt={item.title} className="h-14 w-14 rounded-2xl object-cover" src={buildImageUrl(imageFromItem(item))} />
                          <div>
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.era || "No era set"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-700">€{Number(item.price || 0).toLocaleString()}</td>
                      <td className="px-4 py-4 text-slate-700">{item.category?.name || item.category || "-"}</td>
                      <td className="px-4 py-4">
                        <button className={`rounded-full px-3 py-1 font-semibold ${item.sold ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}`} onClick={() => handleToggle(item, "sold")} type="button">
                          {item.sold ? "Sold" : "Available"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button className={`rounded-full px-3 py-1 font-semibold ${item.featured ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`} onClick={() => handleToggle(item, "featured")} type="button">
                          {item.featured ? "Featured" : "Standard"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link className="admin-button-secondary inline-flex w-auto" to={`/admin/items/${id}`}>
                            Edit
                          </Link>
                          <button className="rounded-2xl bg-rose-600 px-4 py-2 font-semibold text-white" onClick={() => handleDelete(id)} type="button">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
