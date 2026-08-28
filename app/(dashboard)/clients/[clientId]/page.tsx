import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/modules/clients/service";
import { PageHeader, WaveRule } from "@/components/layout/page-header";
import { InfoItem, MissingBanner } from "@/components/layout/missing-info";
import { DeleteClientButton } from "@/components/clients/delete-client-button";
import { InviteClientButton } from "@/components/clients/invite-client-button";

const REQUIRED_FIELDS = [
  "dateNaissance",
  "residenceFiscale",
  "telephone",
  "email",
  "adresse",
] as const;

export default async function ClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const client = await getClientById(supabase, clientId);

  if (!client) notFound();

  const missingCount = REQUIRED_FIELDS.filter((f) => !client[f]).length;

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

      <Section title="Identité">
        <InfoItem label="Date de naissance" value={client.dateNaissance} required />
        <InfoItem label="Résidence fiscale" value={client.residenceFiscale} required />
        <InfoItem label="Téléphone" value={client.telephone} required />
        <InfoItem label="Email" value={client.email} required />
        <InfoItem label="Adresse" value={client.adresse} required />
      </Section>

      <Section title="Situation familiale">
        <InfoItem label="Situation" value={client.situationFamiliale} />
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
        Revenus, charges, patrimoine, objectifs, fiscalité, retraite,
        documents et préconisations seront disponibles aux étapes suivantes
        de l'outil.
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
