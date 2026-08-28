"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Header({ userName }: { userName?: string | null }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-foreground/70">{userName ?? "Conseiller"}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-foreground/60 transition hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </header>
  );
}
