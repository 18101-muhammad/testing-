import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buildImageUrl, createItem, getAdminCategories, getItemById, updateItem } from "../../api/api";
import AdminShell from "../../components/AdminShell";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

const eraOptions = [
  "Victorian",
  "Georgian",
  "Art Deco",
  "Edwardian",
  "Tudor",
  "Modern",
  "Early 19th Century",
  "Mid 19th Century",
  "Late 19th Century",
  "Early 20th Century",
  "Mid 20th Century",
  "Late 20th Century",
];
const conditionOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  era: "Early 19th Century",
  condition: "Excellent",
  featured: false,
  sold: false,
};

const imagePath = (image) => (typeof image === "string" ? image : image?.url || image?.path);

export default function AdminItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditMode = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesResponse = await getAdminCategories(token);
        setCategories(categoriesResponse?.categories || categoriesResponse || []);

        if (isEditMode) {
          setLoading(true);
          const response = await getItemById(id);
          const item = response?.item || response;
          setForm({
            title: item.title || "",
            description: item.description || "",
            price: item.price || "",
            category: item.category?._id || item.category?.id || item.category || "",
            era: item.era || "Early 19th Century",
            condition: item.condition || "Excellent",
            featured: Boolean(item.featured),
            sold: Boolean(item.sold),
          });
          setExistingImages(Array.isArray(item.images) ? item.images : [item.image || item.imageUrl].filter(Boolean));
        }
      } catch {
        setServerError("We could not load this form right now.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode, token]);

  const previews = useMemo(() => files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })), [files]);

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews]
  );

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.price && form.price !== 0) nextErrors.price = "Price is required.";
    if (!form.category) nextErrors.category = "Category is required.";
    if (!isEditMode && files.length === 0) nextErrors.images = "At least one image is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const markImageForRemoval = (image) => {
    const path = imagePath(image);
    setRemovedImages((current) => [...current, path]);
    setExistingImages((current) => current.filter((entry) => imagePath(entry) !== path));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      setServerError("");
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, typeof value === "boolean" ? String(value) : value));
      files.forEach((file) => formData.append("images", file));
      removedImages.forEach((image) => formData.append("removeImages", image));
      formData.append("removedImages", JSON.stringify(removedImages));

      if (isEditMode) {
        await updateItem(id, formData, token);
      } else {
        await createItem(formData, token);
      }

      navigate("/admin/items");
    } catch {
      setServerError("This item could not be saved. Please review the form and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading item form..." />;
  }

  return (
    <AdminShell title={isEditMode ? "Edit Item" : "Add New Item"}>
      <form className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="admin-label" htmlFor="title">
              Title
            </label>
            <input className="admin-input" id="title" name="title" onChange={handleChange} value={form.title} />
            {errors.title ? <p className="text-sm text-red-600">{errors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="admin-label" htmlFor="price">
              Price (EUR)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
              <input className="admin-input pl-8" id="price" min="0" name="price" onChange={handleChange} type="number" value={form.price} />
            </div>
            {errors.price ? <p className="text-sm text-red-600">{errors.price}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="admin-label" htmlFor="description">
            Description
          </label>
          <textarea className="admin-input min-h-[180px]" id="description" name="description" onChange={handleChange} value={form.description} />
          {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="admin-label" htmlFor="category">
              Category
            </label>
            <select className="admin-input" id="category" name="category" onChange={handleChange} value={form.category}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id || category.id} value={category._id || category.id || category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category ? <p className="text-sm text-red-600">{errors.category}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="admin-label" htmlFor="era">
              Era
            </label>
            <select className="admin-input" id="era" name="era" onChange={handleChange} value={form.era}>
              {eraOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="admin-label" htmlFor="condition">
              Condition
            </label>
            <select className="admin-input" id="condition" name="condition" onChange={handleChange} value={form.condition}>
              {conditionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input checked={form.featured} name="featured" onChange={handleChange} type="checkbox" />
            Featured
          </label>
          <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input checked={form.sold} name="sold" onChange={handleChange} type="checkbox" />
            Sold
          </label>
        </div>

        <div className="space-y-3">
          <label className="admin-label" htmlFor="images">
            Upload Images
          </label>
          <input accept=".jpg,.jpeg,.png,.webp" className="admin-input" id="images" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} type="file" />
          {errors.images ? <p className="text-sm text-red-600">{errors.images}</p> : null}
          {previews.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {previews.map((preview) => (
                <div className="overflow-hidden rounded-2xl border border-slate-200" key={preview.name}>
                  <img alt={preview.name} className="aspect-square w-full object-cover" src={preview.url} />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {isEditMode && existingImages.length ? (
          <div className="space-y-3">
            <label className="admin-label">Existing Images</label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {existingImages.map((image) => {
                const path = imagePath(image);
                return (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200" key={path}>
                    <img alt="Existing item" className="aspect-square w-full object-cover" src={buildImageUrl(path)} />
                    <button className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700" onClick={() => markImageForRemoval(image)} type="button">
                      X
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {serverError ? <p className="rounded-2xl bg-red-50 p-4 text-red-700">{serverError}</p> : null}

        <button className="admin-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : isEditMode ? "Update Item" : "Create Item"}
        </button>
      </form>
    </AdminShell>
  );
}
