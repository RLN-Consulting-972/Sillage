import {
  Document, Page, View, Text, StyleSheet, Svg, Path, Image,
} from "@react-pdf/renderer";
import type { RapportData } from "./data";
import { buildDonutPaths, buildHorizontalBars } from "./charts";
import { situationFamilialeLabel } from "@/modules/clients/types";

const COLORS = {
  primary: "#000000",
  accent: "#C4A160",
  accentDark: "#8A6A2F",
  plum: "#8C2859",
  bordeaux: "#6E1E33",
  muted: "#7A7668",
  border: "#E4E1D8",
  background: "#F6F5F2",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1E2530",
  },
  coverPage: {
    padding: 0,
    fontFamily: "Helvetica",
  },
  h1: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 4,
  },
  h2: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 4,
  },
  waveRule: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 14,
  },
  muted: { color: COLORS.muted, fontSize: 9 },
  section: { marginBottom: 22 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  statGrid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    padding: 10,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  statLabel: { fontSize: 8, color: COLORS.muted, marginBottom: 3 },
  statValue: { fontFamily: "Helvetica-Bold", fontSize: 13, color: COLORS.primary },
  table: { borderWidth: 0.5, borderColor: COLORS.border, borderRadius: 4 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowLast: { borderBottomWidth: 0 },
  tableCellLabel: { flex: 2, fontSize: 9 },
  tableCellValue: { flex: 1, fontSize: 9, textAlign: "right" },
  placeholderBox: {
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 4,
    padding: 12,
  },
  placeholderText: { fontSize: 9, color: COLORS.muted, fontStyle: "italic" },
  opportuniteCard: {
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  opportuniteTitre: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 2 },
  opportuniteRaison: { fontSize: 8.5, color: COLORS.muted },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7.5,
    color: COLORS.muted,
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 6,
  },
});

function formatEUR(n: number): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(n);
  // La police par défaut du PDF (Helvetica) n'a pas le glyphe de
  // l'espace fine insécable utilisée par le formatage français — sans
  // ce remplacement, elle s'affiche comme un "/" illisible.
  return formatted.replace(/[\u202F\u00A0]/g, " ");
}

function SectionTitle({ children }: { children: string }) {
  return (
    <View>
      <Text style={styles.h2}>{children}</Text>
      <View style={styles.waveRule} />
    </View>
  );
}

function Placeholder({ children }: { children: string }) {
  return (
    <View style={styles.placeholderBox}>
      <Text style={styles.placeholderText}>{children}</Text>
    </View>
  );
}

function Footer({ page }: { page: string }) {
  return (
    <Text style={styles.footer} fixed>
      Sillage — by RLN Consulting · Document confidentiel destiné exclusivement au client concerné · {page}
    </Text>
  );
}

function DonutChart({
  slices,
}: {
  slices: { value: number; color: string; label: string }[];
}) {
  const paths = buildDonutPaths(slices, 60, 60, 55, 30);
  if (paths.length === 0) {
    return <Placeholder>Pas encore de patrimoine renseigné pour ce graphique.</Placeholder>;
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
      <Svg width={120} height={120} viewBox="0 0 120 120">
        {paths.map((p) => (
          <Path key={p.label} d={p.path} fill={p.color} />
        ))}
      </Svg>
      <View>
        {paths.map((p) => (
          <View key={p.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: p.color }]} />
            <Text style={{ fontSize: 9 }}>
              {p.label} — {Math.round(p.pourcentage)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function BarChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const bars = buildHorizontalBars(data, 220);
  return (
    <View>
      {bars.map((b) => (
        <View key={b.label} style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
            <Text style={{ fontSize: 9 }}>{b.label}</Text>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{formatEUR(b.value)}</Text>
          </View>
          <View style={{ width: 220, height: 8, backgroundColor: COLORS.background, borderRadius: 2 }}>
            <View style={{ width: b.width, height: 8, backgroundColor: b.color, borderRadius: 2 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function RapportDocument({
  data,
  logoBase64,
}: {
  data: RapportData;
  logoBase64?: string;
}) {
  const { client, synthese, revenus, charges, biens, actifs, opportunites, documents } = data;
  const nomComplet = `${client.civilite ? client.civilite + " " : ""}${client.prenom} ${client.nom}`;

  const pieces_manquantes = documents.filter((d) => d.statut === "manquant");

  return (
    <Document
      title={`Rapport patrimonial — ${nomComplet}`}
      author="RLN Consulting"
      subject="Analyse patrimoniale"
    >
      {/* 1. COUVERTURE */}
      <Page size="A4" style={styles.coverPage}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
          {logoBase64 && (
            <Image src={logoBase64} style={{ width: 90, height: 90, marginBottom: 24 }} />
          )}
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 26, color: COLORS.primary, marginBottom: 4 }}>
            Sillage
          </Text>
          <Text style={{ fontSize: 11, color: COLORS.accentDark, fontStyle: "italic", marginBottom: 60 }}>
            by RLN Consulting
          </Text>
          <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: COLORS.primary, marginBottom: 6 }}>
            Bilan patrimonial
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.primary, marginBottom: 40 }}>{nomComplet}</Text>
          <Text style={{ fontSize: 9, color: COLORS.muted }}>Document généré le {data.genereLe}</Text>
        </View>
        <Text style={styles.footer} fixed>
          Sillage — by RLN Consulting · Document confidentiel destiné exclusivement au client concerné
        </Text>
      </Page>

      {/* 2. VOTRE SITUATION EN BREF */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>{nomComplet}</Text>
        <View style={styles.waveRule} />

        <View style={styles.section}>
          <SectionTitle>Votre situation en bref</SectionTitle>
          <View style={styles.row}>
            <Text style={{ fontSize: 9, color: COLORS.muted }}>Situation familiale</Text>
            <Text style={{ fontSize: 9 }}>{situationFamilialeLabel(client.situationFamiliale)}</Text>
          </View>
          {client.conjoint && (client.conjoint.nom || client.conjoint.prenom) && (
            <View style={styles.row}>
              <Text style={{ fontSize: 9, color: COLORS.muted }}>Conjoint</Text>
              <Text style={{ fontSize: 9 }}>
                {client.conjoint.prenom} {client.conjoint.nom}
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={{ fontSize: 9, color: COLORS.muted }}>Enfants</Text>
            <Text style={{ fontSize: 9 }}>{client.enfants.length}</Text>
          </View>

          <View style={{ height: 12 }} />

          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Patrimoine net</Text>
              <Text style={styles.statValue}>{formatEUR(synthese.patrimoineNet)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Revenus mensuels</Text>
              <Text style={styles.statValue}>{formatEUR(synthese.revenusMensuels)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Capacité d'épargne</Text>
              <Text style={styles.statValue}>{formatEUR(synthese.capaciteEpargne)}</Text>
            </View>
          </View>
        </View>

        <Footer page="2" />
      </Page>

      {/* 3. VOTRE PATRIMOINE */}
      <Page size="A4" style={styles.page}>
        <SectionTitle>Votre patrimoine</SectionTitle>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Patrimoine brut</Text>
            <Text style={styles.statValue}>{formatEUR(synthese.patrimoineBrut)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Crédits restants</Text>
            <Text style={styles.statValue}>{formatEUR(synthese.creditRestant)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Patrimoine net</Text>
            <Text style={styles.statValue}>{formatEUR(synthese.patrimoineNet)}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          Répartition immobilier / financier
        </Text>
        <View style={{ marginBottom: 20 }}>
          <DonutChart
            slices={[
              { value: synthese.patrimoineImmobilierBrut, color: COLORS.accent, label: "Immobilier" },
              { value: synthese.patrimoineFinancier, color: COLORS.plum, label: "Financier" },
            ]}
          />
        </View>

        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          Patrimoine immobilier ({biens.length})
        </Text>
        {biens.length === 0 ? (
          <Placeholder>Aucun bien immobilier renseigné dans le dossier.</Placeholder>
        ) : (
          <View style={[styles.table, { marginBottom: 16 }]}>
            {biens.map((b, i) => (
              <View key={b.id} style={[styles.tableRow, i === biens.length - 1 ? styles.tableRowLast : undefined]}>
                <Text style={styles.tableCellLabel}>{data.labels.immobilier(b.type)}</Text>
                <Text style={styles.tableCellValue}>{formatEUR(b.valeurEstimee)}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          Placements financiers ({actifs.length})
        </Text>
        {actifs.length === 0 ? (
          <Placeholder>Aucun placement financier renseigné dans le dossier.</Placeholder>
        ) : (
          <View style={styles.table}>
            {actifs.map((a, i) => (
              <View key={a.id} style={[styles.tableRow, i === actifs.length - 1 ? styles.tableRowLast : undefined]}>
                <Text style={styles.tableCellLabel}>{data.labels.financier(a.type)}</Text>
                <Text style={styles.tableCellValue}>{formatEUR(a.montant)}</Text>
              </View>
            ))}
          </View>
        )}

        <Footer page="3" />
      </Page>

      {/* 4. VOS REVENUS ET CHARGES */}
      <Page size="A4" style={styles.page}>
        <SectionTitle>Vos revenus et charges</SectionTitle>

        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          Vue mensuelle
        </Text>
        <View style={{ marginBottom: 20 }}>
          <BarChart
            data={[
              { label: "Revenus", value: synthese.revenusMensuels, color: COLORS.accent },
              { label: "Charges", value: synthese.chargesMensuelles, color: COLORS.bordeaux },
            ]}
          />
        </View>

        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          Revenus détaillés ({revenus.length})
        </Text>
        {revenus.length === 0 ? (
          <Placeholder>Aucun revenu renseigné dans le dossier.</Placeholder>
        ) : (
          <View style={[styles.table, { marginBottom: 16 }]}>
            {revenus.map((r, i) => (
              <View key={r.id} style={[styles.tableRow, i === revenus.length - 1 ? styles.tableRowLast : undefined]}>
                <Text style={styles.tableCellLabel}>{data.labels.revenu(r.type)}</Text>
                <Text style={styles.tableCellValue}>
                  {formatEUR(r.montant)} / {r.periodicite === "annuel" ? "an" : "mois"}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          Charges détaillées ({charges.length})
        </Text>
        {charges.length === 0 ? (
          <Placeholder>Aucune charge renseignée dans le dossier.</Placeholder>
        ) : (
          <View style={styles.table}>
            {charges.map((c, i) => (
              <View key={c.id} style={[styles.tableRow, i === charges.length - 1 ? styles.tableRowLast : undefined]}>
                <Text style={styles.tableCellLabel}>{data.labels.charge(c.type)}</Text>
                <Text style={styles.tableCellValue}>
                  {formatEUR(c.montant)} / {c.periodicite === "annuel" ? "an" : "mois"}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Footer page="4" />
      </Page>

      {/* 5-8. FISCALITÉ / RETRAITE / PROTECTION / TRANSMISSION */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionTitle>Votre fiscalité</SectionTitle>
          <Placeholder>
            Cette section sera complétée une fois le module fiscalité construit dans l'outil.
          </Placeholder>
        </View>
        <View style={styles.section}>
          <SectionTitle>Votre retraite</SectionTitle>
          <Placeholder>
            Cette section sera complétée une fois le module retraite construit dans l'outil.
          </Placeholder>
        </View>
        <View style={styles.section}>
          <SectionTitle>Votre protection</SectionTitle>
          <Placeholder>
            Cette section sera complétée une fois le module protection construit dans l'outil.
          </Placeholder>
        </View>
        <View style={styles.section}>
          <SectionTitle>Votre transmission</SectionTitle>
          {client.enfants.length > 0 || (client.conjoint && client.conjoint.nom) ? (
            <View style={styles.table}>
              {client.conjoint && client.conjoint.nom && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Conjoint</Text>
                  <Text style={styles.tableCellValue}>
                    {client.conjoint.prenom} {client.conjoint.nom}
                  </Text>
                </View>
              )}
              {client.enfants.map((e, i) => (
                <View
                  key={e.id ?? i}
                  style={[styles.tableRow, i === client.enfants.length - 1 ? styles.tableRowLast : undefined]}
                >
                  <Text style={styles.tableCellLabel}>Enfant</Text>
                  <Text style={styles.tableCellValue}>{e.prenom}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Placeholder>Aucune information familiale renseignée pour l'instant.</Placeholder>
          )}
          <Text style={[styles.placeholderText, { marginTop: 6 }]}>
            L'analyse successorale elle-même sera disponible une fois le module transmission construit.
          </Text>
        </View>

        <Footer page="5" />
      </Page>

      {/* 9-10. POINTS FORTS / POINTS DE VIGILANCE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionTitle>Points forts</SectionTitle>
          <Placeholder>
            À compléter par votre conseillère lors de l'entretien de restitution.
          </Placeholder>
        </View>
        <View style={styles.section}>
          <SectionTitle>Points de vigilance</SectionTitle>
          <Placeholder>
            À compléter par votre conseillère lors de l'entretien de restitution.
          </Placeholder>
        </View>

        {/* 11. OPPORTUNITÉS IDENTIFIÉES */}
        <View style={styles.section}>
          <SectionTitle>Opportunités identifiées</SectionTitle>
          {opportunites.length === 0 ? (
            <Placeholder>
              Aucune opportunité détectée avec les informations actuellement renseignées.
            </Placeholder>
          ) : (
            opportunites.map((o) => (
              <View key={o.id} style={styles.opportuniteCard}>
                <Text style={styles.opportuniteTitre}>{o.titre}</Text>
                <Text style={styles.opportuniteRaison}>{o.raison}</Text>
              </View>
            ))
          )}
          <Text style={[styles.placeholderText, { marginTop: 6 }]}>
            Ces pistes sont calculées automatiquement à partir de votre dossier et seront
            discutées et validées avec votre conseillère avant toute mise en œuvre.
          </Text>
        </View>

        <Footer page="6" />
      </Page>

      {/* 12-13. PRÉCONISATIONS VALIDÉES / SCÉNARIOS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionTitle>Préconisations validées</SectionTitle>
          <Placeholder>
            Aucune préconisation n'a encore été validée par votre conseillère pour ce dossier.
          </Placeholder>
        </View>
        <View style={styles.section}>
          <SectionTitle>Scénarios</SectionTitle>
          <Placeholder>
            Cette section sera complétée une fois le module de simulation construit dans l'outil.
          </Placeholder>
        </View>

        {/* 14. PLAN D'ACTION */}
        <View style={styles.section}>
          <SectionTitle>Plan d'action</SectionTitle>
          {opportunites.filter((o) => o.priorite === "haute").length === 0 ? (
            <Placeholder>
              Aucune action prioritaire identifiée automatiquement pour l'instant.
            </Placeholder>
          ) : (
            <View style={styles.table}>
              {opportunites
                .filter((o) => o.priorite === "haute")
                .map((o, i, arr) => (
                  <View key={o.id} style={[styles.tableRow, i === arr.length - 1 ? styles.tableRowLast : undefined]}>
                    <Text style={styles.tableCellLabel}>{o.titre}</Text>
                    <Text style={[styles.tableCellValue, { color: COLORS.bordeaux }]}>Priorité haute</Text>
                  </View>
                ))}
            </View>
          )}
          <Text style={[styles.placeholderText, { marginTop: 6 }]}>
            Plan d'action provisoire basé sur les opportunités de priorité haute — à valider et
            détailler avec votre conseillère.
          </Text>
        </View>

        <Footer page="7" />
      </Page>

      {/* 15. ANNEXES */}
      <Page size="A4" style={styles.page}>
        <SectionTitle>Annexes</SectionTitle>

        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          Documents du dossier ({documents.length})
        </Text>
        {documents.length === 0 ? (
          <Placeholder>Aucun document demandé pour ce dossier.</Placeholder>
        ) : (
          <View style={[styles.table, { marginBottom: 16 }]}>
            {documents.map((d, i) => (
              <View key={d.id} style={[styles.tableRow, i === documents.length - 1 ? styles.tableRowLast : undefined]}>
                <Text style={styles.tableCellLabel}>{d.nom}</Text>
                <Text
                  style={[
                    styles.tableCellValue,
                    { color: d.statut === "recu" ? "#3C6E52" : COLORS.bordeaux },
                  ]}
                >
                  {d.statut === "recu" ? "Reçu" : "Manquant"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {pieces_manquantes.length > 0 && (
          <Text style={{ fontSize: 9, color: COLORS.bordeaux, marginBottom: 16 }}>
            {pieces_manquantes.length} pièce{pieces_manquantes.length > 1 ? "s" : ""} encore
            manquante{pieces_manquantes.length > 1 ? "s" : ""} pour compléter ce dossier.
          </Text>
        )}

        <Text style={{ fontSize: 8, color: COLORS.muted, marginTop: 30 }}>
          Ce document a été préparé par RLN Consulting à partir des informations transmises par
          le client. Il ne constitue pas un conseil personnalisé tant qu'il n'a pas été présenté
          et commenté par la conseillère lors d'un entretien dédié. Les opportunités mentionnées
          sont des pistes de réflexion générées automatiquement, non des recommandations
          définitives.
        </Text>

        <Footer page="8" />
      </Page>
    </Document>
  );
}
