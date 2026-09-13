/**
 * Système unifié "information manquante", validé sur la maquette :
 * une seule couleur (bordeaux) pour tout ce qui relève d'une donnée
 * absente dans le dossier — que ce soit bloquant (astérisque de
 * formulaire) ou non-bloquant (badge dans la fiche client).
 * Le rouge (--danger) reste réservé aux vrais échecs techniques.
 */

export function RequiredMark() {
  return <span className="text-bordeaux">*</span>;
}

export function MissingBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-md border border-bordeaux/20 bg-bordeaux/5 px-3 py-2 text-[12.5px] text-bordeaux">
      {children}
    </div>
  );
}

export function InfoItem({
  label,
  value,
  required,
}: {
  label: string;
  value?: string | null;
  required?: boolean;
}) {
  const isMissing = required && !value;
  return (
    <div>
      <p className="text-[10.5px] tracking-wide text-foreground/50">{label}</p>
      {isMissing ? (
        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-bordeaux">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-bordeaux" />
          Manquant
        </p>
      ) : (
        <p className="mt-0.5 text-[13.5px] text-foreground">{value || "—"}</p>
      )}
    </div>
  );
}
