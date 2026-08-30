import { NextResponse } from "next/server";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import { listImmobilier, createImmobilier } from "@/modules/finances/service";
import { createImmobilierSchema } from "@/modules/finances/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const biens = await listImmobilier(supabase, clientId);
  return NextResponse.json({ biens });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const parsed = createImmobilierSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    const bien = await createImmobilier(supabase, clientId, parsed.data);
    return NextResponse.json({ bien }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible d'ajouter le bien" }, { status: 500 });
  }
}
