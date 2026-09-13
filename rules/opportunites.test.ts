import { describe, it, expect } from "vitest";
import { detecterOpportunites, type DonneesClientPourRegles } from "./opportunites";

function donneesVides(): DonneesClientPourRegles {
  return { revenus: [], charges: [], biens: [], actifs: [] };
}

describe("detecterOpportunites", () => {
  it("ne déclenche rien sur un dossier vide", () => {
    expect(detecterOpportunites(donneesVides())).toEqual([]);
  });

  it("détecte la concentration immobilière au-delà de 70%", () => {
    const data = donneesVides();
    data.biens = [{ valeurEstimee: 800000, creditRestant: 0, mensualiteCredit: 0 }];
    data.actifs = [{ montant: 100000, type: "livret_a" }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "concentration-immobiliere")).toBe(true);
  });

  it("ne déclenche PAS la concentration immobilière sous 70%", () => {
    const data = donneesVides();
    data.biens = [{ valeurEstimee: 300000, creditRestant: 0, mensualiteCredit: 0 }];
    data.actifs = [{ montant: 300000, type: "livret_a" }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "concentration-immobiliere")).toBe(false);
  });

  it("détecte une faible liquidité (moins de 3 mois de charges couverts)", () => {
    const data = donneesVides();
    data.charges = [{ montant: 2000, periodicite: "mensuel", type: "loyer" }];
    data.actifs = [{ montant: 1000, type: "livret_a" }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "faible-liquidite")).toBe(true);
  });

  it("ne déclenche pas la faible liquidité si l'épargne couvre largement les charges", () => {
    const data = donneesVides();
    data.charges = [{ montant: 1000, periodicite: "mensuel", type: "loyer" }];
    data.actifs = [{ montant: 10000, type: "livret_a" }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "faible-liquidite")).toBe(false);
  });

  it("détecte un endettement élevé (> 33% des revenus)", () => {
    const data = donneesVides();
    data.revenus = [{ montant: 2000, periodicite: "mensuel" }];
    data.biens = [{ valeurEstimee: 200000, creditRestant: 150000, mensualiteCredit: 900 }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "endettement-eleve")).toBe(true);
  });

  it("détecte l'assurance emprunteur à vérifier dès qu'un crédit est en cours", () => {
    const data = donneesVides();
    data.biens = [{ valeurEstimee: 200000, creditRestant: 50000, mensualiteCredit: 400 }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "assurance-emprunteur-a-verifier")).toBe(true);
  });

  it("ne déclenche pas l'assurance emprunteur si le crédit est soldé", () => {
    const data = donneesVides();
    data.biens = [{ valeurEstimee: 200000, creditRestant: 0, mensualiteCredit: 0 }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "assurance-emprunteur-a-verifier")).toBe(false);
  });

  it("détecte un regroupement de crédits possible (2 crédits ou plus)", () => {
    const data = donneesVides();
    data.charges = [
      { montant: 300, periodicite: "mensuel", type: "credit_consommation" },
      { montant: 200, periodicite: "mensuel", type: "leasing" },
    ];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "regroupement-credits")).toBe(true);
  });

  it("ne déclenche pas le regroupement avec un seul crédit", () => {
    const data = donneesVides();
    data.charges = [{ montant: 300, periodicite: "mensuel", type: "credit_consommation" }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "regroupement-credits")).toBe(false);
  });

  it("détecte une capacité d'épargne à valoriser sans PER/assurance-vie", () => {
    const data = donneesVides();
    data.revenus = [{ montant: 4000, periodicite: "mensuel" }];
    data.charges = [{ montant: 2000, periodicite: "mensuel", type: "loyer" }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "capacite-epargne-a-valoriser")).toBe(true);
  });

  it("ne déclenche pas cette opportunité si un PER existe déjà", () => {
    const data = donneesVides();
    data.revenus = [{ montant: 4000, periodicite: "mensuel" }];
    data.charges = [{ montant: 2000, periodicite: "mensuel", type: "loyer" }];
    data.actifs = [{ montant: 5000, type: "per" }];
    const result = detecterOpportunites(data);
    expect(result.some((o) => o.id === "capacite-epargne-a-valoriser")).toBe(false);
  });
});

describe("scénario réaliste — dossier chargé (testé aussi en base réelle)", () => {
  it("déclenche les 6 règles simultanément sur un dossier qui les cumule toutes", () => {
    const data: DonneesClientPourRegles = {
      revenus: [{ montant: 3000, periodicite: "mensuel" }],
      charges: [
        { montant: 200, periodicite: "mensuel", type: "credit_consommation" },
        { montant: 150, periodicite: "mensuel", type: "leasing" },
      ],
      biens: [{ valeurEstimee: 280000, creditRestant: 200000, mensualiteCredit: 1100 }],
      actifs: [{ montant: 800, type: "livret_a" }],
    };
    const result = detecterOpportunites(data);
    const ids = result.map((o) => o.id).sort();
    expect(ids).toEqual(
      [
        "assurance-emprunteur-a-verifier",
        "capacite-epargne-a-valoriser",
        "concentration-immobiliere",
        "endettement-eleve",
        "faible-liquidite",
        "regroupement-credits",
      ].sort()
    );
  });
});
