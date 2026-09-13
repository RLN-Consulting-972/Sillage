"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Le clic sur le lien reçu par email établit automatiquement une
    // session temporaire (gérée par @supabase/ssr) : on vérifie juste
    // qu'elle existe avant d'autoriser le changement de mot de passe.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError(
          "Ce lien de réinitialisation n'est plus valide. Demandez-en un nouveau."
        );
      }
      setReady(true);
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError("Une erreur est survenue. Réessayez.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-sm">
        <h1 className="mb-1 font-serif text-lg font-semibold text-primary">
          Nouveau mot de passe
        </h1>
        <p className="mb-6 font-serif text-xs italic text-accent-dark">
          Sillage — by RLN Consulting
        </p>

        {!ready ? (
          <p className="text-sm text-foreground/60">Vérification du lien...</p>
        ) : success ? (
          <p className="text-sm text-foreground/80">
            Mot de passe mis à jour. Redirection vers la connexion...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Mettre à jour le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
