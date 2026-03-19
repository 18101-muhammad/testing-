import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || "http://localhost:5000";
const CURRENT_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const normalizePayload = (response) => {
  const payload = response?.data;

  if (payload && typeof payload === "object") {
    if ("data" in payload) {
      return payload.data;
    }

    if ("items" in payload || "categories" in payload || "enquiries" in payload || "token" in payload) {
      return payload;
    }
  }

  return payload;
};

const getStoredToken = () => localStorage.getItem("adminToken");

const authConfig = (token = getStoredToken(), extraConfig = {}) => ({
  ...extraConfig,
  headers: {
    ...(extraConfig.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export const buildImageUrl = (path) => {
  if (!path) {
    return "https://placehold.co/900x700/f0e6cc/1a2744?text=Never+The+Twain";
  }

  if (CURRENT_ORIGIN && /^\/uploads\//i.test(path)) {
    return `${CURRENT_ORIGIN}${path}`;
  }

  if (/^https?:\/\//i.test(path)) {
    if (CURRENT_ORIGIN) {
      try {
        const imageUrl = new URL(path);
        if (/^\/uploads\//i.test(imageUrl.pathname)) {
          return `${CURRENT_ORIGIN}${imageUrl.pathname}`;
        }
      } catch (_error) {
        return path;
      }
    }

    return path;
  }

  return `${MEDIA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const getItems = async (filters = {}) => {
  const response = await api.get("/items", { params: filters });
  return normalizePayload(response);
};

export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return normalizePayload(response);
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return normalizePayload(response);
};

export const submitEnquiry = async (data) => {
  const response = await api.post("/enquiries", data);
  return normalizePayload(response);
};

export const getWhatsAppLink = async (itemId) => {
  const response = await api.get("/whatsapp-link", {
    params: itemId ? { itemId } : undefined,
  });
  return normalizePayload(response);
};

export const adminLogin = async (email, password) => {
  const response = await api.post("/admin/login", { email, password });
  return normalizePayload(response);
};

export const getAdminItems = async (filters = {}, token) => {
  const response = await api.get("/admin/items", authConfig(token, { params: filters }));
  return normalizePayload(response);
};

export const createItem = async (formData, token) => {
  const response = await api.post("/admin/items", formData, authConfig(token));
  return normalizePayload(response);
};

export const updateItem = async (id, formData, token) => {
  const response = await api.put(`/admin/items/${id}`, formData, authConfig(token));
  return normalizePayload(response);
};

export const deleteItem = async (id, token) => {
  const response = await api.delete(`/admin/items/${id}`, authConfig(token));
  return normalizePayload(response);
};

export const getAdminCategories = async () => getCategories();

export const createCategory = async (name, token) => {
  const response = await api.post("/admin/categories", { name }, authConfig(token));
  return normalizePayload(response);
};

export const updateCategory = async (id, name, token) => {
  const response = await api.put(`/admin/categories/${id}`, { name }, authConfig(token));
  return normalizePayload(response);
};

export const deleteCategory = async (id, token) => {
  const response = await api.delete(`/admin/categories/${id}`, authConfig(token));
  return normalizePayload(response);
};

export const getEnquiries = async (token) => {
  const response = await api.get("/admin/enquiries", authConfig(token));
  return normalizePayload(response);
};

export const toggleEnquiryRead = async (id, token) => {
  const response = await api.patch(`/admin/enquiries/${id}`, {}, authConfig(token));
  return normalizePayload(response);
};

export const deleteEnquiry = async (id, token) => {
  const response = await api.delete(`/admin/enquiries/${id}`, authConfig(token));
  return normalizePayload(response);
};
