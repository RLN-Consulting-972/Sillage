import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sillage — by RLN Consulting",
  description:
    "Sillage, l'outil de conseil patrimonial 360° de RLN Consulting : découverte client, analyse, préconisations et suivi dans le temps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
