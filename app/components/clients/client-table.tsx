import Link from "next/link";
import type { Client } from "@/modules/clients/types";

export function ClientTable({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return (
      <p className="text-sm text-foreground/50">
        Aucun client. Créez le premier via le bouton ci-dessus.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left text-foreground/60">
          <tr>
            <th className="px-4 py-2 font-medium">Nom</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Téléphone</th>
            <th className="px-4 py-2 font-medium">Situation familiale</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-secondary/40">
              <td className="px-4 py-3">
                <Link href={`/clients/${client.id}`} className="font-medium hover:underline">
                  {client.civilite ? `${client.civilite} ` : ""}
                  {client.prenom} {client.nom}
                </Link>
              </td>
              <td className="px-4 py-3 text-foreground/70">{client.email ?? "—"}</td>
              <td className="px-4 py-3 text-foreground/70">{client.telephone ?? "—"}</td>
              <td className="px-4 py-3 text-foreground/70">
                {client.situationFamiliale ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
