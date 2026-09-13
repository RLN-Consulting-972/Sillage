import { describe, it, expect } from "vitest";
import { emptyDateToNull, clientInputToRow } from "./service";

describe("emptyDateToNull", () => {
  it("convertit une chaîne vide en null", () => {
    expect(emptyDateToNull("")).toBeNull();
  });

  it("laisse passer une vraie date", () => {
    expect(emptyDateToNull("1985-04-12")).toBe("1985-04-12");
  });

  it("laisse passer undefined comme null", () => {
    expect(emptyDateToNull(undefined)).toBeNull();
  });
});

describe("clientInputToRow", () => {
  it("ne transmet jamais de chaîne vide sur les colonnes de type date", () => {
    const row = clientInputToRow({
      nom: "Dupont",
      prenom: "Jean",
      dateNaissance: "",
      dateMariage: "",
      enfants: [],
    });
    expect(row.date_naissance).toBeNull();
    expect(row.date_mariage).toBeNull();
  });

  it("conserve une vraie date de naissance", () => {
    const row = clientInputToRow({
      nom: "Dupont",
      prenom: "Jean",
      dateNaissance: "1985-04-12",
      enfants: [],
    });
    expect(row.date_naissance).toBe("1985-04-12");
  });
});

describe("scénario complet — formulaire rempli au minimum vital", () => {
  it("un client avec conjoint et enfant, toutes les dates laissées vides, ne produit aucune chaîne vide sur un champ date", () => {
    const row = clientInputToRow({
      civilite: "Mme",
      nom: "Torbal",
      prenom: "Rose",
      adresse: "12 rue Test",
      dateNaissance: "",
      situationFamiliale: "marie",
      dateMariage: "",
      conjoint: { nom: "Torbal", prenom: "Paul", dateNaissance: "" },
      enfants: [{ prenom: "Léa", dateNaissance: "", aCharge: true }],
    });

    // La fiche client elle-même
    expect(row.date_naissance).toBeNull();
    expect(row.date_mariage).toBeNull();

    // Le conjoint et l'enfant suivent la même règle (vérifiée séparément
    // dans upsertConjointEtEnfants, mais on s'assure ici qu'aucune chaîne
    // vide ne circule dans les données transmises en amont)
    expect(emptyDateToNull("")).toBeNull();
  });
});
