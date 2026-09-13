import { AlertTriangle } from "lucide-react";
import type { Opportunite, PrioriteOpportunite } from "@/rules/opportunites";

const PRIORITE_STYLE: Record<PrioriteOpportunite, string> = {
  haute: "bg-bordeaux/10 text-bordeaux",
  moyenne: "bg-accent/15 text-accent-dark",
  basse: "bg-secondary text-foreground/60",
};

const PRIORITE_LABEL: Record<PrioriteOpportunite, string> = {
  haute: "Priorité haute",
  moyenne: "À étudier",
  basse: "Pour information",
};

export function OpportunitesSection({ opportunites }: { opportunites: Opportunite[] }) {
  return (
    <section className="mb-4 rounded-xl border border-border bg-background p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-serif text-sm font-medium text-primary">Opportunités</h2>
        <span className="text-[10.5px] text-foreground/40">
          Calculées automatiquement — RULES_V0.1
        </span>
      </div>

      {opportunites.length === 0 ? (
        <p className="mt-3 text-sm text-foreground/50">
          Aucune opportunité détectée pour l'instant avec les informations
          actuellement renseignées.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {opportunites.map((o) => (
            <li key={o.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-accent-dark" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{o.titre}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${PRIORITE_STYLE[o.priorite]}`}>
                    {PRIORITE_LABEL[o.priorite]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground/60">{o.raison}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[10.5px] text-foreground/40">
        Ces pistes sont générées automatiquement à partir du dossier — elles
        ne remplacent jamais votre analyse et ne doivent jamais être
        présentées telles quelles à un client sans validation.
      </p>
    </section>
  );
}
