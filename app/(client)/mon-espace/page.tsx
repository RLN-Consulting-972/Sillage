import { createClient } from "@/lib/supabase/server";
import { getOwnClientRecord } from "@/modules/clients/service";
import { InfoItem } from "@/components/layout/missing-info";

export default async function MonEspacePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La garde du layout parent garantit déjà que `user` existe et que le
  // rôle est "client" ; ce contrôle supplémentaire est là pour que
  // TypeScript le sache aussi, et par prudence.
  if (!user) return null;

  const client = await getOwnClientRecord(supabase, user.id);

  if (!client) {
    return (
      <p className="text-sm text-foreground/60">
        Votre dossier n'a pas encore été relié à votre compte. Contactez
        votre conseillère.
      </p>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-xl font-semibold text-primary">
        Bonjour {client.prenom}
      </h1>
      <p className="mb-6 mt-1 text-sm text-foreground/60">
        Voici les informations que RLN Consulting a enregistrées pour vous.
      </p>

      <section className="mb-4 rounded-xl border border-border bg-background p-5">
        <h2 className="mb-4 font-serif text-sm font-medium text-primary">
          Vos informations
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoItem label="Email" value={client.email} />
          <InfoItem label="Téléphone" value={client.telephone} />
          <InfoItem label="Adresse" value={client.adresse} />
          <InfoItem label="Date de naissance" value={client.dateNaissance} />
        </div>
      </section>

      <div className="rounded-xl border border-dashed border-border p-5 text-sm text-foreground/50">
        Un questionnaire guidé vous permettra bientôt de compléter votre
        dossier vous-même (revenus, patrimoine, objectifs) et de suivre
        l'avancement de votre bilan patrimonial directement ici.
      </div>
    </div>
  );
}
