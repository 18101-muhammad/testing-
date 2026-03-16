import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ title, actions, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <AdminSidebar />

        <main className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Administration</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
