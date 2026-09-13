import { LogoutButton } from "@/components/layout/logout-button";

export function Header({ userName }: { userName?: string | null }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-foreground/70">{userName ?? "Conseiller"}</span>
        <LogoutButton />
      </div>
    </header>
  );
}
