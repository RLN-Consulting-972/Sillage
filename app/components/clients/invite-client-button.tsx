"use client";

import { useState } from "react";
import { UserPlus, CheckCircle2 } from "lucide-react";

export function InviteClientButton({
  clientId,
  hasEmail,
  alreadyInvited,
}: {
  clientId: string;
  hasEmail: boolean;
  alreadyInvited: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    alreadyInvited ? "sent" : "idle"
  );

  async function handleInvite() {
    setStatus("sending");
    const res = await fetch(`/api/clients/${clientId}/inviter`, { method: "POST" });
    setStatus(res.ok ? "sent" : "error");
  }

  if (!hasEmail) {
    return (
      <p className="text-xs text-foreground/40">
        Renseignez un email pour inviter ce client à créer son compte.
      </p>
    );
  }

  if (status === "sent") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-success">
        <CheckCircle2 size={14} />
        Compte client actif
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={handleInvite}
        disabled={status === "sending"}
        className="flex items-center gap-1.5 text-sm text-accent-dark hover:underline disabled:opacity-50"
      >
        <UserPlus size={14} />
        {status === "sending" ? "Envoi de l'invitation..." : "Inviter à se connecter"}
      </button>
      {status === "error" && (
        <p className="mt-1 text-xs text-danger">
          L'invitation n'a pas pu être envoyée. Réessayez.
        </p>
      )}
    </div>
  );
}
