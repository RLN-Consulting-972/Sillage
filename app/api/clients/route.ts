import { NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { listClients, createClient as createClientRecord } from "@/modules/clients/service";
import { clientFormSchema } from "@/modules/clients/schema";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const clients = await listClients(supabase);
    return NextResponse.json({ clients });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de récupérer les clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = clientFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const client = await createClientRecord(supabase, user.id, parsed.data);
    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de créer le client" },
      { status: 500 }
    );
  }
}
