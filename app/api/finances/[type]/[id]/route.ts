import { NextResponse } from "next/server";
import { requireAuthenticatedSupabase } from "@/lib/api/require-auth";
import {
  deleteRevenu, deleteCharge, deleteImmobilier, deleteFinancier, deleteObjectif,
  updateRevenu, updateCharge, updateImmobilier, updateFinancier, updateObjectif,
} from "@/modules/finances/service";
import {
  createRevenuSchema, createChargeSchema, createImmobilierSchema,
  createFinancierSchema, createObjectifSchema,
} from "@/modules/finances/schema";

const DELETE_HANDLERS = {
  revenus: deleteRevenu,
  charges: deleteCharge,
  immobilier: deleteImmobilier,
  financiers: deleteFinancier,
  objectifs: deleteObjectif,
} as const;

// Chaque type associe son schéma de validation et sa fonction de mise à
// jour — le "as any" ci-dessous reste local à cette table de dispatch et
// ne fuit jamais vers le reste du code, chaque fonction restant typée
// strictement dans modules/finances/service.ts.
const UPDATE_HANDLERS = {
  revenus: { schema: createRevenuSchema, update: updateRevenu },
  charges: { schema: createChargeSchema, update: updateCharge },
  immobilier: { schema: createImmobilierSchema, update: updateImmobilier },
  financiers: { schema: createFinancierSchema, update: updateFinancier },
  objectifs: { schema: createObjectifSchema, update: updateObjectif },
} as const;

type FinanceType = keyof typeof DELETE_HANDLERS;

function isValidType(type: string): type is FinanceType {
  return type in DELETE_HANDLERS;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const { supabase, user } = await requireAuthenticatedSupabase();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  if (!isValidType(type)) {
    return NextResponse.json({ error: "Type inconnu" }, { status: 400 });
  }

  const handler = UPDATE_HANDLERS[type];
  const parsed = handler.schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = await (handler.update as any)(supabase, id, parsed.data);
    return NextResponse.json({ record });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Modification impossible" }, { status: 500 });
  }
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
