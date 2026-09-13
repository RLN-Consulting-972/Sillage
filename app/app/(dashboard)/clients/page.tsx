import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/modules/clients/service";
import { ClientTable } from "@/components/clients/client-table";
import { PageHeader } from "@/components/layout/page-header";

export default async function ClientsPage() {
  const supabase = await createClient();
  const clients = await listClients(supabase);

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <PageHeader title="Clients" subtitle={`${clients.length} client(s)`} />
        <Link
          href="/clients/nouveau"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          + Nouveau client
        </Link>
      </div>

      <ClientTable clients={clients} />
    </div>
  );
}
