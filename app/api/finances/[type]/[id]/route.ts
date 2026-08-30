import { NextResponse } from "next/server";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import {
  deleteRevenu, deleteCharge, deleteImmobilier, deleteFinancier, deleteObjectif,
} from "@/modules/finances/service";

const DELETE_HANDLERS = {
  revenus: deleteRevenu,
  charges: deleteCharge,
  immobilier: deleteImmobilier,
  financiers: deleteFinancier,
  objectifs: deleteObjectif,
} as const;

type FinanceType = keyof typeof DELETE_HANDLERS;

function isValidType(type: string): type is FinanceType {
  return type in DELETE_HANDLERS;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  if (!isValidType(type)) {
    return NextResponse.json({ error: "Type inconnu" }, { status: 400 });
  }

  try {
    await DELETE_HANDLERS[type](supabase, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
