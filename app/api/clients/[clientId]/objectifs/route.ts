import { NextResponse } from "next/server";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import { listObjectifs, createObjectif } from "@/modules/finances/service";
import { createObjectifSchema } from "@/modules/finances/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const objectifs = await listObjectifs(supabase, clientId);
  return NextResponse.json({ objectifs });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const parsed = createObjectifSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    const objectif = await createObjectif(supabase, clientId, parsed.data);
    return NextResponse.json({ objectif }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible d'ajouter l'objectif" }, { status: 500 });
  }
}
