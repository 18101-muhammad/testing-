import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getAdminCategories, getAdminItems, updateCategory } from "../../api/api";
import AdminShell from "../../components/AdminShell";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, itemsResponse] = await Promise.all([
          getAdminCategories(token),
          getAdminItems({}, token),
        ]);

        setCategories(categoriesResponse?.categories || categoriesResponse || []);
        setItems(itemsResponse?.items || itemsResponse || []);
      } catch {
        setError("Categories could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const categoryCount = (category) =>
    items.filter((item) => {
      const itemCategory = item.category?._id || item.category?.id || item.category?.name || item.category;
      const categoryId = category._id || category.id;
      return itemCategory === categoryId || itemCategory === category.name;
    }).length;

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      return;
    }

    try {
      await createCategory(newCategory.trim(), token);
      setNewCategory("");
      const [categoriesResponse, itemsResponse] = await Promise.all([
        getAdminCategories(token),
        getAdminItems({}, token),
      ]);
      setCategories(categoriesResponse?.categories || categoriesResponse || []);
      setItems(itemsResponse?.items || itemsResponse || []);
    } catch {
      setError("This category could not be created.");
    }
  };

  const handleRename = async (id) => {
    try {
      await updateCategory(id, editingName.trim(), token);
      setEditingId("");
      setEditingName("");
      const categoriesResponse = await getAdminCategories(token);
      setCategories(categoriesResponse?.categories || categoriesResponse || []);
    } catch {
      setError("This category could not be updated.");
    }
  };

  const handleDelete = async (category) => {
    const count = categoryCount(category);
    const message = count > 0 ? `This category is used by ${count} items. Delete it anyway?` : "Delete this category?";

    if (!window.confirm(message)) {
      return;
    }

    try {
      await deleteCategory(category._id || category.id, token);
      setCategories((current) => current.filter((entry) => (entry._id || entry.id) !== (category._id || category.id)));
    } catch {
      setError("This category could not be deleted.");
    }
  };

  return (
    <AdminShell title="Categories">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input className="admin-input" onChange={(event) => setNewCategory(event.target.value)} placeholder="Add new category" value={newCategory} />
          <button className="admin-button sm:w-auto" onClick={handleAdd} type="button">
            Add
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading categories..." /> : null}
      {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

      {!loading ? (
        <div className="space-y-4">
          {categories.map((category) => {
            const id = category._id || category.id;
            const editing = editingId === id;
            const count = categoryCount(category);

            return (
              <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between" key={id}>
                <div>
                  {editing ? (
                    <input className="admin-input" onChange={(event) => setEditingName(event.target.value)} value={editingName} />
                  ) : (
                    <h2 className="text-xl font-semibold text-slate-900">{category.name}</h2>
                  )}
                  <p className="mt-1 text-sm text-slate-500">{count} items in this category</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {editing ? (
                    <button className="admin-button sm:w-auto" onClick={() => handleRename(id)} type="button">
                      Save
                    </button>
                  ) : (
                    <button
                      className="admin-button-secondary sm:w-auto"
                      onClick={() => {
                        setEditingId(id);
                        setEditingName(category.name);
                      }}
                      type="button"
                    >
                      Rename
                    </button>
                  )}
                  <button className="rounded-2xl bg-rose-600 px-4 py-2 font-semibold text-white" onClick={() => handleDelete(category)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </AdminShell>
  );
}
