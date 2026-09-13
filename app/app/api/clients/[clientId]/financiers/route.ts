import { NextResponse } from "next/server";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import { listFinanciers, createFinancier } from "@/modules/finances/service";
import { createFinancierSchema } from "@/modules/finances/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const actifs = await listFinanciers(supabase, clientId);
  return NextResponse.json({ actifs });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const parsed = createFinancierSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    const actif = await createFinancier(supabase, clientId, parsed.data);
    return NextResponse.json({ actif }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible d'ajouter le placement" }, { status: 500 });
  }
}
