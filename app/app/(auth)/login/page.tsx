"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError(
          "Ce compte n'a pas encore été confirmé. Vérifiez vos emails (et vos indésirables)."
        );
      } else {
        setError("Email ou mot de passe incorrect.");
      }
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-sm">
        <h1 className="mb-0.5 font-serif text-xl font-semibold text-primary">
          Sillage
        </h1>
        <p className="mb-6 font-serif text-xs italic text-accent-dark">
          by RLN Consulting
        </p>

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
          <div>
            <label className="mb-1 block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <Link
            href="/mot-de-passe-oublie"
            className="block text-center text-sm text-foreground/60 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </form>
      </div>
    </div>
  );
}
