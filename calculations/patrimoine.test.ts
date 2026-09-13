import { describe, it, expect } from "vitest";
import {
  calculateRevenusMensuels,
  calculateChargesMensuelles,
  calculateSavingsCapacity,
  calculateGrossWealth,
  calculateNetWealth,
  calculateRealEstateRatio,
  calculateDebtRatio,
  calculateLiquidityMonths,
} from "./patrimoine";

describe("calculateRevenusMensuels", () => {
  it("convertit les revenus annuels en mensuel", () => {
    const total = calculateRevenusMensuels([
      { montant: 3000, periodicite: "mensuel" },
      { montant: 12000, periodicite: "annuel" },
    ]);
    expect(total).toBe(4000); // 3000 + (12000/12)
  });

  it("renvoie 0 sans revenu", () => {
    expect(calculateRevenusMensuels([])).toBe(0);
  });
});

describe("calculateSavingsCapacity", () => {
  it("soustrait les charges des revenus, tout en mensuel", () => {
    const capacite = calculateSavingsCapacity(
      [{ montant: 4000, periodicite: "mensuel" }],
      [{ montant: 2500, periodicite: "mensuel" }]
    );
    expect(capacite).toBe(1500);
  });

  it("peut être négative (charges > revenus)", () => {
    const capacite = calculateSavingsCapacity(
      [{ montant: 1000, periodicite: "mensuel" }],
      [{ montant: 1500, periodicite: "mensuel" }]
    );
    expect(capacite).toBe(-500);
  });
});

describe("calculateGrossWealth / calculateNetWealth", () => {
  const biens = [{ valeurEstimee: 300000, creditRestant: 180000 }];
  const actifs = [{ montant: 50000 }];

  it("le patrimoine brut ignore le crédit restant", () => {
    expect(calculateGrossWealth(biens, actifs)).toBe(350000);
  });

  it("le patrimoine net déduit le crédit restant", () => {
    expect(calculateNetWealth(biens, actifs)).toBe(170000);
  });
});

describe("calculateRealEstateRatio", () => {
  it("calcule la part de l'immobilier dans le patrimoine brut", () => {
    const ratio = calculateRealEstateRatio(
      [{ valeurEstimee: 700000, creditRestant: 0 }],
      [{ montant: 300000 }]
    );
    expect(ratio).toBeCloseTo(0.7);
  });

  it("renvoie 0 sans aucun patrimoine", () => {
    expect(calculateRealEstateRatio([], [])).toBe(0);
  });
});

describe("calculateDebtRatio", () => {
  it("calcule le taux d'endettement (mensualités / revenus)", () => {
    const ratio = calculateDebtRatio(
      [{ mensualiteCredit: 1000 }],
      [{ montant: 3000, periodicite: "mensuel" }]
    );
    expect(ratio).toBeCloseTo(0.333, 2);
  });

  it("renvoie 0 sans revenu (évite la division par zéro)", () => {
    expect(calculateDebtRatio([{ mensualiteCredit: 500 }], [])).toBe(0);
  });
});

describe("calculateLiquidityMonths", () => {
  it("calcule combien de mois de charges sont couverts par l'épargne liquide", () => {
    const mois = calculateLiquidityMonths(
      [{ montant: 6000 }],
      [{ montant: 2000, periodicite: "mensuel" }]
    );
    expect(mois).toBe(3);
  });
});
