import { describe, it, expect } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { RapportDocument } from "./document";
import type { RapportData } from "./data";

function exempleDonnees(): RapportData {
  return {
    client: {
      id: "test-id",
      civilite: "Mme",
      nom: "Martin",
      prenom: "Sophie",
      situationFamiliale: "marie",
      conjoint: { nom: "Martin", prenom: "Paul" },
      enfants: [
        { id: "e1", prenom: "Léa", aCharge: true },
        { id: "e2", prenom: "Tom", aCharge: true },
      ],
      createdAt: "",
      updatedAt: "",
    },
    genereLe: "14 septembre 2026",
    revenus: [
      { id: "r1", clientId: "test-id", type: "salaire_conjoint1", montant: 2600, periodicite: "mensuel" },
    ],
    charges: [
      { id: "c1", clientId: "test-id", type: "impot_revenu_ifi", montant: 150, periodicite: "mensuel" },
    ],
    biens: [
      { id: "b1", clientId: "test-id", type: "residence_principale", valeurEstimee: 280000, creditRestant: 200000, mensualiteCredit: 1100 },
    ],
    actifs: [
      { id: "a1", clientId: "test-id", type: "livret_a", montant: 800 },
    ],
    objectifs: [],
    documents: [
      { id: "d1", clientId: "test-id", nom: "Avis d'imposition", categorie: "avis_imposition", statut: "manquant", createdAt: "", updatedAt: "" },
    ],
    opportunites: [
      { id: "faible-liquidite", titre: "Faible liquidité", raison: "Test", priorite: "haute", categorie: "patrimoine" },
    ],
    synthese: {
      revenusMensuels: 2600,
      chargesMensuelles: 150,
      capaciteEpargne: 2450,
      patrimoineImmobilierBrut: 280000,
      patrimoineFinancier: 800,
      creditRestant: 200000,
      patrimoineBrut: 280800,
      patrimoineNet: 80800,
    },
    labels: {
      revenu: () => "Salaire Conjoint 1",
      charge: () => "Impôt sur le revenu et IFI",
      immobilier: () => "Résidence principale",
      financier: () => "Livret A",
      objectif: () => "",
    },
  };
}

describe("RapportDocument", () => {
  it("génère un vrai PDF valide avec des données complètes", async () => {
    const buffer = await renderToBuffer(RapportDocument({ data: exempleDonnees() }));
    expect(buffer.length).toBeGreaterThan(1000);
    // Un PDF valide commence toujours par cette signature
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("génère un PDF même avec un dossier complètement vide (aucune donnée saisie)", async () => {
    const donneesVides: RapportData = {
      ...exempleDonnees(),
      revenus: [],
      charges: [],
      biens: [],
      actifs: [],
      objectifs: [],
      documents: [],
      opportunites: [],
      client: {
        id: "test-id",
        nom: "Dupont",
        prenom: "Jean",
        enfants: [],
        createdAt: "",
        updatedAt: "",
      },
      synthese: {
        revenusMensuels: 0, chargesMensuelles: 0, capaciteEpargne: 0,
        patrimoineImmobilierBrut: 0, patrimoineFinancier: 0, creditRestant: 0,
        patrimoineBrut: 0, patrimoineNet: 0,
      },
    };
    const buffer = await renderToBuffer(RapportDocument({ data: donneesVides }));
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("fonctionne aussi avec un logo intégré (base64)", async () => {
    // Un pixel PNG transparent, minimal, pour tester le chemin logoBase64
    // sans dépendre d'un vrai fichier
    const pixelPng =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    const buffer = await renderToBuffer(
      RapportDocument({ data: exempleDonnees(), logoBase64: pixelPng })
    );
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
