import { describe, it, expect } from "vitest";
import { createRevenuSchema, createChargeSchema } from "./schema";

describe("createRevenuSchema — catégories du tableau budgétaire réseau", () => {
  it("accepte les nouvelles catégories détaillées", () => {
    const result = createRevenuSchema.safeParse({
      type: "bic_bnc_conjoint1",
      montant: 4000,
      periodicite: "annuel",
    });
    expect(result.success).toBe(true);
  });

  it("accepte toujours les anciennes valeurs génériques (compatibilité)", () => {
    const result = createRevenuSchema.safeParse({
      type: "salaire",
      montant: 3000,
      periodicite: "mensuel",
    });
    expect(result.success).toBe(true);
  });

  it("refuse une catégorie qui n'existe pas", () => {
    const result = createRevenuSchema.safeParse({
      type: "invente",
      montant: 100,
      periodicite: "mensuel",
    });
    expect(result.success).toBe(false);
  });
});

describe("createChargeSchema — catégories du tableau budgétaire réseau", () => {
  it("accepte les nouvelles catégories détaillées (impôts, logement, transports...)", () => {
    for (const type of ["impot_revenu_ifi", "energies", "assurance_auto_moto", "prets_divers"]) {
      const result = createChargeSchema.safeParse({ type, montant: 100, periodicite: "mensuel" });
      expect(result.success, `${type} devrait être accepté`).toBe(true);
    }
  });

  it("accepte toujours les anciennes valeurs génériques (compatibilité)", () => {
    const result = createChargeSchema.safeParse({
      type: "credit_immobilier",
      montant: 900,
      periodicite: "mensuel",
    });
    expect(result.success).toBe(true);
  });
});
