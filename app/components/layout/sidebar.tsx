import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 flex-col border-r border-border bg-background md:flex">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
        <Image
          src="/rln-macaron.png"
          alt="RLN Consulting"
          width={36}
          height={36}
          className="shrink-0"
        />
        <div>
          <p className="font-serif text-base font-semibold leading-tight text-primary">
            Sillage
          </p>
          <p className="font-serif text-[10px] italic leading-tight text-accent-dark">
            by RLN Consulting
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-md border-l-2 border-transparent px-3 py-2 text-sm text-foreground/80 transition hover:bg-secondary hover:text-foreground"
          >
            <Icon className="h-4 w-4 opacity-70" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border px-4 py-3 text-[10px] leading-relaxed text-foreground/50">
        RLN Consulting — Conseillère en Finances &amp; Patrimoine
      </div>
    </aside>
  );
}
