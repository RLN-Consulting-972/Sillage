import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/modules/clients/service";
import { situationFamilialeLabel } from "@/modules/clients/types";
import { listDocuments } from "@/modules/documents/service";
import {
  listRevenus, listCharges, listImmobilier, listFinanciers, listObjectifs,
} from "@/modules/finances/service";
import {
  REVENU_TYPES, CHARGE_TYPES, IMMOBILIER_TYPES, FINANCIER_TYPES,
  OBJECTIF_TYPES, PERIODICITES, PRIORITES,
} from "@/modules/finances/types";
import {
  calculateRevenusMensuels, calculateChargesMensuelles, calculateSavingsCapacity,
  calculateGrossWealth, calculateNetWealth,
} from "@/calculations/patrimoine";
import { detecterOpportunites } from "@/rules/opportunites";
import { PageHeader, WaveRule } from "@/components/layout/page-header";
import { InfoItem, MissingBanner } from "@/components/layout/missing-info";
import { DeleteClientButton } from "@/components/clients/delete-client-button";
import { InviteClientButton } from "@/components/clients/invite-client-button";
import { DocumentsSection } from "@/components/clients/documents-section";
import { FinanceSection } from "@/components/clients/finance-section";
import { OpportunitesSection } from "@/components/clients/opportunites-section";
import { StatCard } from "@/components/layout/stat-card";

const REQUIRED_FIELDS = [
  "dateNaissance",
  "residenceFiscale",
  "telephone",
  "email",
  "adresse",
] as const;

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const client = await getClientById(supabase, clientId);

  if (!client) notFound();

  const [documents, revenus, charges, biens, actifs, objectifs] = await Promise.all([
    listDocuments(supabase, clientId),
    listRevenus(supabase, clientId),
    listCharges(supabase, clientId),
    listImmobilier(supabase, clientId),
    listFinanciers(supabase, clientId),
    listObjectifs(supabase, clientId),
  ]);

  const missingCount = REQUIRED_FIELDS.filter((f) => !client[f]).length;

  const revenusMensuels = calculateRevenusMensuels(revenus);
  const chargesMensuelles = calculateChargesMensuelles(charges);
  const capaciteEpargne = calculateSavingsCapacity(revenus, charges);
  const patrimoineBrut = calculateGrossWealth(
    biens.map((b) => ({ valeurEstimee: b.valeurEstimee, creditRestant: b.creditRestant })),
    actifs
  );
  const patrimoineNet = calculateNetWealth(
    biens.map((b) => ({ valeurEstimee: b.valeurEstimee, creditRestant: b.creditRestant })),
    actifs
  );

  const opportunites = detecterOpportunites({ revenus, charges, biens, actifs });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-primary">
            {client.civilite ? `${client.civilite} ` : ""}
            {client.prenom} {client.nom}
          </h1>
          <WaveRule />
        </div>
        <div className="flex gap-4">
          <Link
            href={`/clients/${client.id}/modifier`}
            className="flex items-center gap-1 text-sm text-accent-dark hover:underline"
          >
            <Edit2 size={13} />
            Modifier
          </Link>
          <DeleteClientButton
            clientId={client.id}
            clientName={`${client.prenom} ${client.nom}`}
          />
        </div>
      </div>

      {missingCount > 0 && (
        <MissingBanner>
          {missingCount} information{missingCount > 1 ? "s" : ""} manquante
          {missingCount > 1 ? "s" : ""} dans le dossier
        </MissingBanner>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Patrimoine brut" value={formatEUR(patrimoineBrut)} />
        <StatCard label="Patrimoine net" value={formatEUR(patrimoineNet)} />
        <StatCard label="Revenus mensuels" value={formatEUR(revenusMensuels)} />
        <StatCard
          label="Capacité d'épargne"
          value={formatEUR(capaciteEpargne)}
          hint={capaciteEpargne < 0 ? "Charges > revenus" : undefined}
        />
      </div>

      <OpportunitesSection opportunites={opportunites} />

      <Section title="Identité">
        <InfoItem label="Date de naissance" value={client.dateNaissance} required />
        <InfoItem label="Résidence fiscale" value={client.residenceFiscale} required />
        <InfoItem label="Téléphone" value={client.telephone} required />
        <InfoItem label="Email" value={client.email} required />
        <InfoItem label="Adresse" value={client.adresse} required />
      </Section>

      <Section title="Situation familiale">
        <InfoItem label="Situation" value={situationFamilialeLabel(client.situationFamiliale)} />
        {client.situationFamiliale === "marie" && (
          <>
            <InfoItem label="Régime matrimonial" value={client.regimeMatrimonial} />
            <InfoItem label="Date de mariage" value={client.dateMariage} />
            <InfoItem
              label="Contrat de mariage"
              value={client.contratMariage ? "Oui" : "Non"}
            />
          </>
        )}
      </Section>

      {client.conjoint && (client.conjoint.nom || client.conjoint.prenom) && (
        <Section title="Conjoint">
          <InfoItem
            label="Nom"
            value={`${client.conjoint.prenom ?? ""} ${client.conjoint.nom ?? ""}`.trim()}
          />
          <InfoItem label="Date de naissance" value={client.conjoint.dateNaissance} />
        </Section>
      )}

      <Section title={`Enfants (${client.enfants.length})`}>
        {client.enfants.length === 0 ? (
          <p className="text-sm text-foreground/50">Aucun enfant renseigné.</p>
        ) : (
          <ul className="space-y-2">
            {client.enfants.map((enfant, i) => (
              <li key={enfant.id ?? i} className="text-sm">
                <span className="font-medium">{enfant.prenom}</span>
                {enfant.dateNaissance && ` — né(e) le ${enfant.dateNaissance}`}
                {enfant.aCharge ? " — à charge" : ""}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <FinanceSection
        title="Revenus"
        listUrl={`/api/clients/${client.id}/revenus`}
        deleteUrlPrefix="/api/finances/revenus"
        items={revenus}
        emptyLabel="Aucun revenu renseigné."
        fields={[
          { key: "type", label: "Type", kind: "select", options: REVENU_TYPES },
          { key: "montant", label: "Montant", kind: "number" },
          { key: "periodicite", label: "Périodicité", kind: "select", options: PERIODICITES },
          { key: "titulaire", label: "Titulaire", kind: "text" },
        ]}
      />

      <FinanceSection
        title="Charges"
        listUrl={`/api/clients/${client.id}/charges`}
        deleteUrlPrefix="/api/finances/charges"
        items={charges}
        emptyLabel="Aucune charge renseignée."
        fields={[
          { key: "type", label: "Type", kind: "select", options: CHARGE_TYPES },
          { key: "montant", label: "Montant", kind: "number" },
          { key: "periodicite", label: "Périodicité", kind: "select", options: PERIODICITES },
        ]}
      />

      <FinanceSection
        title="Patrimoine immobilier"
        listUrl={`/api/clients/${client.id}/immobilier`}
        deleteUrlPrefix="/api/finances/immobilier"
        items={biens}
        emptyLabel="Aucun bien immobilier renseigné."
        fields={[
          { key: "type", label: "Type de bien", kind: "select", options: IMMOBILIER_TYPES },
          { key: "valeurEstimee", label: "Valeur estimée", kind: "number" },
          { key: "creditRestant", label: "Crédit restant dû", kind: "number" },
          { key: "mensualiteCredit", label: "Mensualité", kind: "number" },
        ]}
      />

      <FinanceSection
        title="Placements financiers"
        listUrl={`/api/clients/${client.id}/financiers`}
        deleteUrlPrefix="/api/finances/financiers"
        items={actifs}
        emptyLabel="Aucun placement renseigné."
        fields={[
          { key: "type", label: "Type de placement", kind: "select", options: FINANCIER_TYPES },
          { key: "montant", label: "Montant", kind: "number" },
          { key: "etablissement", label: "Établissement", kind: "text" },
        ]}
      />

      <FinanceSection
        title="Objectifs"
        listUrl={`/api/clients/${client.id}/objectifs`}
        deleteUrlPrefix="/api/finances/objectifs"
        items={objectifs}
        emptyLabel="Aucun objectif renseigné."
        fields={[
          { key: "type", label: "Objectif", kind: "select", options: OBJECTIF_TYPES },
          { key: "montantCible", label: "Montant cible", kind: "number" },
          { key: "echeance", label: "Échéance", kind: "text" },
          { key: "priorite", label: "Priorité", kind: "select", options: PRIORITES },
        ]}
      />

      <DocumentsSection clientId={client.id} initialDocuments={documents} />

      <Section title="Espace client">
        <div className="sm:col-span-2">
          <InviteClientButton
            clientId={client.id}
            hasEmail={Boolean(client.email)}
            alreadyInvited={Boolean(client.userId)}
          />
        </div>
      </Section>

      <div className="rounded-xl border border-dashed border-border p-5 text-sm text-foreground/50">
        Fiscalité, retraite et préconisations seront disponibles aux étapes
        suivantes de l'outil. Le patrimoine brut/net et la capacité
        d'épargne ci-dessus sont calculés automatiquement à partir des
        revenus, charges et patrimoine renseignés.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 rounded-xl border border-border bg-background p-5">
      <h2 className="mb-4 font-serif text-sm font-medium text-primary">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

