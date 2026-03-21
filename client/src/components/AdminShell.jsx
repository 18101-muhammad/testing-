import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ title, actions, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 sm:py-8 lg:grid-cols-[280px_1fr] lg:gap-8 lg:px-8">
        <AdminSidebar />

        <main className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:rounded-[28px] sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Administration</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
            </div>
            {actions ? <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
