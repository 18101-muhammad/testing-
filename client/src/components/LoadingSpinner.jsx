export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <div className="paper-panel flex items-center gap-3 rounded-full border border-[#2f382d]/10 px-5 py-3 shadow-soft">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#b68a3c]/20 border-t-[#b68a3c]" />
        <span className="text-sm font-medium text-[#263024]">{label}</span>
      </div>
    </div>
  );
}
