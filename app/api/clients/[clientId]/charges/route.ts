import { NextResponse } from "next/server";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import { listCharges, createCharge } from "@/modules/finances/service";
import { createChargeSchema } from "@/modules/finances/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const charges = await listCharges(supabase, clientId);
  return NextResponse.json({ charges });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const parsed = createChargeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    const charge = await createCharge(supabase, clientId, parsed.data);
    return NextResponse.json({ charge }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible d'ajouter la charge" }, { status: 500 });
  }
}
