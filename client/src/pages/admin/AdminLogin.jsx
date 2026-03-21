import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate replace to="/admin/dashboard" />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login(form.email, form.password);
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Twain Antiques & Curios</title>
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin Access</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in</h1>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <input className="admin-input" name="email" onChange={handleChange} placeholder="Email" required type="email" value={form.email} />
            <input className="admin-input" name="password" onChange={handleChange} placeholder="Password" required type="password" value={form.password} />

            {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

            <button className="admin-button" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
