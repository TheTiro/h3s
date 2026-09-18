export function PlaceholderFrame({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center border border-border bg-surface-soft text-muted ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="px-4 text-center text-[11px] font-medium uppercase tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}
