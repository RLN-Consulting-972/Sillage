"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function MotDePasseOubliePage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    });

    setLoading(false);

    if (error) {
      setError("Une erreur est survenue. Réessayez.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-sm">
        <h1 className="mb-1 font-serif text-lg font-semibold text-primary">
          Mot de passe oublié
        </h1>
        <p className="mb-6 font-serif text-xs italic text-accent-dark">
          Sillage — by RLN Consulting
        </p>

        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">
              Si un compte existe avec cet email, un lien de réinitialisation
              vient d'être envoyé. Pense à vérifier tes courriers indésirables.
            </p>
            <Link href="/login" className="block text-sm text-accent-dark hover:underline">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
            </button>

            <Link
              href="/login"
              className="block text-center text-sm text-foreground/60 hover:underline"
            >
              Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
