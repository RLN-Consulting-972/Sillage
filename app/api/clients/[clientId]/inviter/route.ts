import { NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientById } from "@/modules/clients/service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // getClientById passe par le client "normal" (RLS active) : si le
  // conseiller connecté n'est pas le propriétaire du dossier, la requête
  // ne renverra simplement rien plutôt que de fuiter les données d'un
  // autre conseiller.
  const client = await getClientById(supabase, clientId);
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }
  if (!client.email) {
    return NextResponse.json(
      { error: "Ce client n'a pas d'adresse email renseignée." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const origin = new URL(request.url).origin;

  // Le rôle et le nom sont transmis dans les métadonnées : c'est le
  // trigger public.handle_new_user() (migration 0003) qui les lira pour
  // créer automatiquement le bon profil, de façon fiable côté base de
  // données plutôt que dans ce code applicatif.
  const { data: invited, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(client.email, {
      redirectTo: `${origin}/reinitialiser-mot-de-passe`,
      data: {
        role: "client",
        full_name: `${client.prenom} ${client.nom}`,
      },
    });

  if (inviteError || !invited.user) {
    console.error(inviteError);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'invitation." },
      { status: 500 }
    );
  }

  const { error: linkError } = await admin
    .from("clients")
    .update({ user_id: invited.user.id })
    .eq("id", clientId);
  if (linkError) {
    console.error(linkError);
    return NextResponse.json(
      { error: "Impossible de relier le compte à la fiche client." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
