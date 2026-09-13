import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/modules/clients/service";
import {
  listRevenus, listCharges, listImmobilier, listFinanciers,
} from "@/modules/finances/service";
import {
  calculateRevenusMensuels, calculateSavingsCapacity, calculateGrossWealth,
} from "@/calculations/patrimoine";
import { detecterOpportunites } from "@/rules/opportunites";
import { StatCard } from "@/components/layout/stat-card";
import { PageHeader } from "@/components/layout/page-header";

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const clients = await listClients(supabase);

  const parDossier = await Promise.all(
    clients.map(async (c) => {
      const [revenus, charges, biens, actifs] = await Promise.all([
        listRevenus(supabase, c.id),
        listCharges(supabase, c.id),
        listImmobilier(supabase, c.id),
        listFinanciers(supabase, c.id),
      ]);
      return {
        patrimoineBrut: calculateGrossWealth(biens, actifs),
        capaciteEpargne: calculateSavingsCapacity(revenus, charges),
        nbOpportunites: detecterOpportunites({ revenus, charges, biens, actifs }).length,
        aDesDonnees: revenus.length > 0 || charges.length > 0,
      };
    })
  );

  const hasFinancialData = parDossier.some((d) => d.aDesDonnees);
  const patrimoineBrutTotal = parDossier.reduce((total, d) => total + d.patrimoineBrut, 0);
  const capaciteEpargneMoyenne = hasFinancialData
    ? parDossier.reduce((total, d) => total + d.capaciteEpargne, 0) / parDossier.length
    : 0;
  const opportunitesTotal = parDossier.reduce((total, d) => total + d.nbOpportunites, 0);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre portefeuille clients"
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clients actifs" value={String(clients.length)} />
        <StatCard
          label="Patrimoine brut suivi"
          value={hasFinancialData ? formatEUR(patrimoineBrutTotal) : "—"}
          hint={!hasFinancialData ? "Renseignez le patrimoine d'un client" : undefined}
        />
        <StatCard
          label="Capacité d'épargne moyenne"
          value={hasFinancialData ? formatEUR(capaciteEpargneMoyenne) : "—"}
          hint={!hasFinancialData ? "Renseignez revenus et charges" : undefined}
        />
        <StatCard
          label="Opportunités identifiées"
          value={String(opportunitesTotal)}
          hint="Sur l'ensemble du portefeuille"
        />
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-sm font-medium text-primary">
            Derniers clients
          </h2>
          <Link href="/clients" className="text-sm text-accent-dark hover:underline">
            Voir tous les clients
          </Link>
        </div>
        {clients.length === 0 ? (
          <p className="text-sm text-foreground/50">
            Aucun client pour le moment.{" "}
            <Link href="/clients/nouveau" className="text-accent-dark hover:underline">
              Créer votre premier client
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {clients.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/clients/${c.id}`} className="hover:underline">
                  {c.prenom} {c.nom}
                </Link>
                <span className="text-foreground/40">{c.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
