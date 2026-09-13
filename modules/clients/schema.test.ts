import { describe, it, expect } from "vitest";
import { clientFormSchema } from "./schema";

describe("clientFormSchema", () => {
  it("accepte un client avec seulement nom et prénom (tous les autres champs vides)", () => {
    const result = clientFormSchema.safeParse({
      civilite: "",
      nom: "Dupont",
      prenom: "Jean",
      dateNaissance: "",
      adresse: "",
      telephone: "",
      email: "",
      residenceFiscale: "",
      situationFamiliale: "", // <-- exactement le bug signalé : le <select>
                              //     HTML envoie "" quand rien n'est choisi
      regimeMatrimonial: "",
      dateMariage: "",
    });
    expect(result.success).toBe(true);
  });

  it("refuse toujours un client sans nom", () => {
    const result = clientFormSchema.safeParse({ prenom: "Jean" });
    expect(result.success).toBe(false);
  });

  it("accepte une vraie situation familiale valide", () => {
    const result = clientFormSchema.safeParse({
      nom: "Dupont",
      prenom: "Jean",
      situationFamiliale: "marie",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.situationFamiliale).toBe("marie");
    }
  });
});
