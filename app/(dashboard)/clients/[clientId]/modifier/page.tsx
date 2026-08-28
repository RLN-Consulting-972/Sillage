import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/modules/clients/service";
import { ClientForm } from "@/components/clients/client-form";
import { PageHeader } from "@/components/layout/page-header";

export default async function ModifierClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const client = await getClientById(supabase, clientId);

  if (!client) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Modifier le client"
        subtitle={`${client.prenom} ${client.nom}`}
      />
      <ClientForm
        initialClient={client}
        onSubmitUrl={`/api/clients/${client.id}`}
        method="PATCH"
      />
    </div>
  );
}
