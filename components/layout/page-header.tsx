export function WaveRule() {
  return (
    <svg width="52" height="10" viewBox="0 0 52 10" className="my-2.5 block">
      <path
        d="M1 6 C 6 1, 11 1, 16 6 C 21 11, 26 11, 31 6 C 36 1, 41 1, 46 6 C 48 8, 50 8, 51 6"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h1 className="font-serif text-2xl font-semibold text-primary">{title}</h1>
      <WaveRule />
      {subtitle && (
        <p className="font-serif text-sm italic text-foreground/60">{subtitle}</p>
      )}
    </div>
  );
}
