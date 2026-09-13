import { ClientForm } from "@/components/clients/client-form";
import { PageHeader } from "@/components/layout/page-header";

export default function NouveauClientPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nouveau client"
        subtitle="Renseignez l'identité et la situation familiale"
      />
      <ClientForm onSubmitUrl="/api/clients" method="POST" />
    </div>
  );
}
