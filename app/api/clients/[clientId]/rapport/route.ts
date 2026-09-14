import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import { buildRapportData } from "@/modules/rapport/data";
import { RapportDocument } from "@/modules/rapport/document";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const data = await buildRapportData(supabase, clientId);
  if (!data) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  let logoBase64: string | undefined;
  try {
    const logoPath = path.join(process.cwd(), "public", "rln-macaron.png");
    const logoBuffer = fs.readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    // Le rapport reste généré sans logo si le fichier est introuvable —
    // ce n'est jamais bloquant pour livrer le document au client.
    logoBase64 = undefined;
  }

  const buffer = await renderToBuffer(RapportDocument({ data, logoBase64 }));

  const nomFichier = `Bilan-patrimonial-${data.client.nom}-${data.client.prenom}.pdf`
    .replace(/\s+/g, "-");

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomFichier}"`,
    },
  });
}
