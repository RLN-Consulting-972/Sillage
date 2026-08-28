export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-[11px] text-foreground/50">{label}</p>
      <p className="mt-1 font-serif text-xl font-semibold text-primary">{value}</p>
      {hint && <p className="mt-1 text-[10.5px] text-foreground/40">{hint}</p>}
    </div>
  );
}
