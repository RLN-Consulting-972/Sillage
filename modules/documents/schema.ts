import { z } from "zod";
import { CATEGORIES } from "./types";

const categorieValues = CATEGORIES.map((c) => c.value) as [
  (typeof CATEGORIES)[number]["value"],
  ...(typeof CATEGORIES)[number]["value"][],
];

export const createDocumentSchema = z.object({
  nom: z.string().min(1, "Le nom de la pièce est requis"),
  categorie: z.enum(categorieValues),
  note: z.string().optional(),
});

export const updateDocumentStatutSchema = z.object({
  statut: z.enum(["manquant", "recu"]),
});

export type CreateDocumentValues = z.infer<typeof createDocumentSchema>;
