"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteClientButton({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Supprimer définitivement le dossier de ${clientName} ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    setDeleting(true);
    const res = await fetch(`/api/clients/${clientId}`, { method: "DELETE" });
    setDeleting(false);

    if (res.ok) {
      router.push("/clients");
      router.refresh();
    } else {
      window.alert("La suppression a échoué. Réessayez.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="flex items-center gap-1 text-sm text-bordeaux hover:underline disabled:opacity-50"
    >
      <Trash2 size={13} />
      {deleting ? "Suppression..." : "Supprimer"}
    </button>
  );
}
