import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/modules/clients/service";
import { StatCard } from "@/components/layout/stat-card";
import { PageHeader } from "@/components/layout/page-header";

export default async function DashboardPage() {
  const supabase = await createClient();
  const clients = await listClients(supabase);

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
          value="—"
          hint="Disponible en Phase 3"
        />
        <StatCard
          label="Capacité d'épargne moyenne"
          value="—"
          hint="Disponible en Phase 3"
        />
        <StatCard
          label="Opportunités identifiées"
          value="—"
          hint="Disponible en Phase 6"
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
