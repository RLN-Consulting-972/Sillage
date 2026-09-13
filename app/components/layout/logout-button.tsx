"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-foreground/60 transition hover:bg-secondary"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </button>
  );
}
