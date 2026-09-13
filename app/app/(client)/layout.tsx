import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/layout/logout-button";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Un conseiller ou un admin qui arriverait ici par erreur repart vers
  // son propre espace — cette zone est réservée au rôle "client".
  if (profile?.role !== "client") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
        <div className="flex items-center gap-2.5">
          <Image src="/rln-macaron.png" alt="RLN Consulting" width={30} height={30} />
          <div>
            <p className="font-serif text-sm font-semibold leading-tight text-primary">
              Sillage
            </p>
            <p className="font-serif text-[10px] italic leading-tight text-accent-dark">
              by RLN Consulting
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground/70">{profile?.full_name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-2xl p-6">{children}</main>
    </div>
  );
}
