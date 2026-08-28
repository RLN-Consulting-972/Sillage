import { z } from "zod";

export const situationFamilialeSchema = z.enum([
  "celibataire",
  "marie",
  "pacse",
  "concubinage",
  "divorce",
  "veuf",
]);

export const enfantSchema = z.object({
  id: z.string().uuid().optional(),
  prenom: z.string().min(1, "Le prénom est requis"),
  dateNaissance: z.string().optional(),
  aCharge: z.boolean().default(true),
  situation: z.string().optional(),
  notesTransmission: z.string().optional(),
});

export const conjointSchema = z.object({
  id: z.string().uuid().optional(),
  civilite: z.string().optional(),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  dateNaissance: z.string().optional(),
});

export const clientFormSchema = z.object({
  civilite: z.string().optional(),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  dateNaissance: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  residenceFiscale: z.string().optional(),
  situationFamiliale: situationFamilialeSchema.optional(),
  regimeMatrimonial: z.string().optional(),
  dateMariage: z.string().optional(),
  contratMariage: z.boolean().optional(),
  conjoint: conjointSchema.optional(),
  enfants: z.array(enfantSchema).optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
