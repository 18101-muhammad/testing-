import { Fragment, useEffect, useMemo, useState } from "react";
import { deleteEnquiry, getEnquiries, toggleEnquiryRead } from "../../api/api";
import AdminShell from "../../components/AdminShell";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

export default function AdminEnquiries() {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [expandedId, setExpandedId] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnquiries = async () => {
      try {
        setLoading(true);
        const response = await getEnquiries(token);
        setEnquiries(response?.enquiries || response || []);
      } catch {
        setError("Enquiries could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    loadEnquiries();
  }, [token]);

  const filteredEnquiries = useMemo(
    () => enquiries.filter((entry) => (filter === "unread" ? !entry.read : true)),
    [enquiries, filter]
  );

  const handleToggleRead = async (id) => {
    try {
      const updated = await toggleEnquiryRead(id, token);
      const next = updated?.enquiry || updated;
      setEnquiries((current) =>
        current.map((entry) => ((entry._id || entry.id) === id ? { ...entry, ...next, read: next?.read ?? !entry.read } : entry))
      );
    } catch {
      setError("The read state could not be updated.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) {
      return;
    }

    try {
      await deleteEnquiry(id, token);
      setEnquiries((current) => current.filter((entry) => (entry._id || entry.id) !== id));
    } catch {
      setError("This enquiry could not be deleted.");
    }
  };

  return (
    <AdminShell title="Enquiries">
      <div className="flex gap-3">
        <button className={filter === "all" ? "admin-button w-auto" : "admin-button-secondary w-auto"} onClick={() => setFilter("all")} type="button">
          All
        </button>
        <button className={filter === "unread" ? "admin-button w-auto" : "admin-button-secondary w-auto"} onClick={() => setFilter("unread")} type="button">
          Unread
        </button>
      </div>

      {loading ? <LoadingSpinner label="Loading enquiries..." /> : null}
      {error ? <p className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</p> : null}

      {!loading ? (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">Name</th>
                  <th className="px-4 py-4 font-semibold">Email</th>
                  <th className="px-4 py-4 font-semibold">Phone Number</th>
                  <th className="px-4 py-4 font-semibold">Message</th>
                  <th className="px-4 py-4 font-semibold">Date</th>
                  <th className="px-4 py-4 font-semibold">Item</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => {
                  const id = enquiry._id || enquiry.id;
                  const expanded = expandedId === id;
                  return (
                    <Fragment key={id}>
                      <tr className={`cursor-pointer border-t border-slate-100 ${!enquiry.read ? "bg-amber-50/60" : ""}`} onClick={() => setExpandedId(expanded ? "" : id)}>
                        <td className="px-4 py-4 font-semibold text-slate-900">{enquiry.name}</td>
                        <td className="px-4 py-4 text-slate-600">{enquiry.email}</td>
                        <td className="px-4 py-4 text-slate-600">{enquiry.phone || "-"}</td>
                        <td className="px-4 py-4 text-slate-600">
                          {(enquiry.message || "").slice(0, 60)}
                          {(enquiry.message || "").length > 60 ? "..." : ""}
                        </td>
                        <td className="px-4 py-4 text-slate-600">{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : "-"}</td>
                        <td className="px-4 py-4 text-slate-600">{enquiry.item?.title || enquiry.itemReference || "-"}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 font-semibold ${enquiry.read ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-700"}`}>
                            {enquiry.read ? "Read" : "Unread"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button className="admin-button-secondary w-auto" onClick={(event) => { event.stopPropagation(); handleToggleRead(id); }} type="button">
                              {enquiry.read ? "Mark Unread" : "Mark Read"}
                            </button>
                            <button className="rounded-2xl bg-rose-600 px-4 py-2 font-semibold text-white" onClick={(event) => { event.stopPropagation(); handleDelete(id); }} type="button">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expanded ? (
                        <tr className="border-t border-slate-100 bg-slate-50">
                          <td className="px-4 py-4 text-slate-700" colSpan="7">
                            {enquiry.phone ? <p className="mb-2 text-sm font-semibold text-slate-800">Phone: {enquiry.phone}</p> : null}
                            <p className="text-sm leading-7">{enquiry.message}</p>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
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
