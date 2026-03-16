export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full bg-white/80 px-5 py-3 shadow-soft">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-antique-gold/30 border-t-antique-gold" />
        <span className="text-sm font-medium text-antique-navy">{label}</span>
      </div>
    </div>
  );
}
