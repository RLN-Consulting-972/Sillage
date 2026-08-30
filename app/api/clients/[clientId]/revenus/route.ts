import { NextResponse } from "next/server";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import { listRevenus, createRevenu } from "@/modules/finances/service";
import { createRevenuSchema } from "@/modules/finances/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const revenus = await listRevenus(supabase, clientId);
  return NextResponse.json({ revenus });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const parsed = createRevenuSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    const revenu = await createRevenu(supabase, clientId, parsed.data);
    return NextResponse.json({ revenu }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible d'ajouter le revenu" }, { status: 500 });
  }
}
