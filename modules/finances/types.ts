export const REVENU_TYPES = [
  // Revenus d'activité
  { value: "salaire_conjoint1", label: "Salaire Conjoint 1", groupe: "Revenus d'activité" },
  { value: "salaire_conjoint2", label: "Salaire Conjoint 2", groupe: "Revenus d'activité" },
  { value: "bonus_conjoint1", label: "Bonus annuel Conjoint 1", groupe: "Revenus d'activité" },
  { value: "bonus_conjoint2", label: "Bonus annuel Conjoint 2", groupe: "Revenus d'activité" },
  { value: "bic_bnc_conjoint1", label: "BIC / BNC Conjoint 1", groupe: "Revenus d'activité" },
  { value: "bic_bnc_conjoint2", label: "BIC / BNC Conjoint 2", groupe: "Revenus d'activité" },
  { value: "benefices_agricoles_conjoint1", label: "Bénéfices agricoles Conjoint 1", groupe: "Revenus d'activité" },
  { value: "benefices_agricoles_conjoint2", label: "Bénéfices agricoles Conjoint 2", groupe: "Revenus d'activité" },
  { value: "revenus_gerant_conjoint1", label: "Revenus de gérant/associé Conjoint 1", groupe: "Revenus d'activité" },
  { value: "revenus_gerant_conjoint2", label: "Revenus de gérant/associé Conjoint 2", groupe: "Revenus d'activité" },
  { value: "prestations_sociales", label: "Prestations sociales (maternité, maladie)", groupe: "Revenus d'activité" },
  { value: "allocation_chomage_conjoint1", label: "Allocation chômage Conjoint 1", groupe: "Revenus d'activité" },
  { value: "allocation_chomage_conjoint2", label: "Allocation chômage Conjoint 2", groupe: "Revenus d'activité" },

  // Pensions
  { value: "pension_retraite_conjoint1", label: "Pension retraite ou invalidité Conjoint 1", groupe: "Pensions" },
  { value: "pension_retraite_conjoint2", label: "Pension retraite ou invalidité Conjoint 2", groupe: "Pensions" },
  { value: "pension_alimentaire_recue", label: "Pension alimentaire reçue", groupe: "Pensions" },
  { value: "rente_viagere", label: "Rente viagère", groupe: "Pensions" },

  // Revenus fonciers
  { value: "revenus_fonciers_conjoint1", label: "Revenus fonciers (locatifs, SCI, SCPI) Conjoint 1", groupe: "Revenus fonciers" },
  { value: "revenus_fonciers_conjoint2", label: "Revenus fonciers (locatifs, SCI, SCPI) Conjoint 2", groupe: "Revenus fonciers" },

  // Aides sociales
  { value: "caf_secu_conjoint1", label: "CAF / sécurité sociale Conjoint 1", groupe: "Aides sociales" },
  { value: "caf_secu_conjoint2", label: "CAF / sécurité sociale Conjoint 2", groupe: "Aides sociales" },
  { value: "autres_aides", label: "Autres aides", groupe: "Aides sociales" },

  // Autres
  { value: "autre_revenu", label: "Autre revenu", groupe: "Autres revenus" },

  // Conservés pour compatibilité avec des données déjà saisies
  { value: "salaire", label: "Salaire (générique)", groupe: "Général (ancien)" },
  { value: "revenus_professionnels", label: "Revenus professionnels (générique)", groupe: "Général (ancien)" },
  { value: "revenus_fonciers", label: "Revenus fonciers (générique)", groupe: "Général (ancien)" },
  { value: "pensions", label: "Pensions (générique)", groupe: "Général (ancien)" },
  { value: "retraites", label: "Retraites (générique)", groupe: "Général (ancien)" },
  { value: "dividendes", label: "Dividendes", groupe: "Général (ancien)" },
  { value: "interets", label: "Intérêts", groupe: "Général (ancien)" },
  { value: "autres", label: "Autres (générique)", groupe: "Général (ancien)" },
] as const;

export const CHARGE_TYPES = [
  // 1. Impôts et cotisations
  { value: "impot_revenu_ifi", label: "Impôt sur le revenu et IFI", groupe: "Impôts et cotisations" },
  { value: "urssaf_emploi_domicile", label: "URSSAF emploi à domicile", groupe: "Impôts et cotisations" },
  { value: "cotisations_independant", label: "Cotisations sociales indépendant (régime micro)", groupe: "Impôts et cotisations" },

  // 2. Logement
  { value: "loyer_ou_pret_principal", label: "Loyer ou prêt résidence principale/secondaire", groupe: "Logement" },
  { value: "taxes_foncieres_habitation", label: "Taxe(s) foncière(s) et d'habitation", groupe: "Logement" },
  { value: "assurance_pret", label: "Assurance de prêt", groupe: "Logement" },
  { value: "charges_copropriete", label: "Charges de copropriété, syndic, garage…", groupe: "Logement" },
  { value: "ameublement_electromenager", label: "Ameublement et électroménager", groupe: "Logement" },
  { value: "energies", label: "Énergies (électricité, gaz, bois, fioul, eau)", groupe: "Logement" },
  { value: "telephone_internet", label: "Téléphone, internet, Canal+", groupe: "Logement" },
  { value: "residence_secondaire_entretien", label: "Résidence secondaire (charges, entretien)", groupe: "Logement" },
  { value: "bricolage_travaux", label: "Bricolage et travaux", groupe: "Logement" },
  { value: "assurance_habitation_scolaire", label: "Assurance habitation/scolaire", groupe: "Logement" },

  // 3. Vie courante
  { value: "alimentation", label: "Alimentation (courses, lunchbox, sandwich…)", groupe: "Vie courante" },
  { value: "vetements", label: "Vêtements, sacs et chaussures", groupe: "Vie courante" },
  { value: "depenses_fetes", label: "Dépenses apéro, fêtes, anniversaires", groupe: "Vie courante" },
  { value: "beaute_coiffeur", label: "Beauté, coiffeur, pressing", groupe: "Vie courante" },
  { value: "soins_non_rembourses", label: "Soins (para)médicaux non remboursés", groupe: "Vie courante" },
  { value: "assurance_sante", label: "Assurance santé (mutuelle)", groupe: "Vie courante" },
  { value: "autres_courses", label: "Autres courses non alimentaires", groupe: "Vie courante" },
  { value: "employe_domicile", label: "Employé à domicile (ménage, jardin…)", groupe: "Vie courante" },
  { value: "depenses_pro_microentrepreneur", label: "Dépenses pro (si microentrepreneur)", groupe: "Vie courante" },

  // 4. Enfants
  { value: "frais_scolaires", label: "Frais scolaires (cantine, étude, périscolaire)", groupe: "Enfants" },
  { value: "frais_garde", label: "Frais de garde (garderie, crèche, nourrice…)", groupe: "Enfants" },
  { value: "transport_enfants", label: "Transports et loyers enfants", groupe: "Enfants" },
  { value: "pension_alimentaire_versee", label: "Pension alimentaire payée / argent de poche", groupe: "Enfants" },
  { value: "activites_enfants", label: "Activités enfants", groupe: "Enfants" },

  // 5. Animaux
  { value: "nourriture_garde_animaux", label: "Nourriture et garde", groupe: "Animaux" },
  { value: "soins_veterinaires", label: "Soins vétérinaires et toilettage", groupe: "Animaux" },

  // 6. Transports
  { value: "abonnement_transport_commun", label: "Abonnements train/métro/car", groupe: "Transports" },
  { value: "entretien_vehicule", label: "Entretien et contrôle technique véhicule ou vélo", groupe: "Transports" },
  { value: "assurance_auto_moto", label: "Assurance auto/moto", groupe: "Transports" },
  { value: "carburant", label: "Carburant (essence, diesel, électrique…)", groupe: "Transports" },
  { value: "peage_abonnement", label: "Péage, abonnement Coyote", groupe: "Transports" },

  // 7. Banque et assurance
  { value: "prets_divers", label: "Prêts divers (auto, travaux, conso, étudiant…)", groupe: "Banque et assurance" },
  { value: "assurance_prevoyance", label: "Assurance prévoyance", groupe: "Banque et assurance" },
  { value: "frais_bancaires", label: "Frais bancaires (CB, forfait, agios…)", groupe: "Banque et assurance" },

  // 8. Immobilier locatif
  { value: "pret_immobilier_locatif", label: "Prêt immobilier locatif", groupe: "Immobilier locatif" },
  { value: "assurance_pret_locatif", label: "Assurance prêt locatif", groupe: "Immobilier locatif" },
  { value: "assurance_pno", label: "Assurance propriétaire non occupant", groupe: "Immobilier locatif" },
  { value: "charges_copro_locatif", label: "Frais de copropriété, entretien, gestion locative", groupe: "Immobilier locatif" },
  { value: "travaux_immo_locatif", label: "Travaux immo locatif", groupe: "Immobilier locatif" },

  // 9. Loisirs
  { value: "activites_loisirs", label: "Activités (sport, musique, poterie, club…)", groupe: "Loisirs" },
  { value: "sorties_culturelles", label: "Sorties (théâtre, cinéma, concert)", groupe: "Loisirs" },
  { value: "presse_livres", label: "Presse, livres, multimédia, bibliothèque", groupe: "Loisirs" },
  { value: "restaurants", label: "Restaurants et livraisons repas", groupe: "Loisirs" },
  { value: "tabac_jeux", label: "Tabac, PMU, loterie", groupe: "Loisirs" },
  { value: "vacances", label: "Vacances, week-ends et voyages", groupe: "Loisirs" },
  { value: "sorties_amis", label: "Sorties apéro, amis, bars, matchs", groupe: "Loisirs" },
  { value: "abonnements_loisirs", label: "Autres abonnements (Netflix, musique, jeux vidéo)", groupe: "Loisirs" },

  // 10. Autres charges
  { value: "dons", label: "Dons", groupe: "Autres charges" },
  { value: "cadeaux", label: "Cadeaux (Noël et anniversaires)", groupe: "Autres charges" },
  { value: "autre_charge", label: "Autre", groupe: "Autres charges" },

  // Conservés pour compatibilité avec des données déjà saisies
  { value: "credit_immobilier", label: "Crédit immobilier (générique)", groupe: "Général (ancien)" },
  { value: "credit_consommation", label: "Crédit consommation (générique)", groupe: "Général (ancien)" },
  { value: "leasing", label: "Leasing (générique)", groupe: "Général (ancien)" },
  { value: "loyer", label: "Loyer (générique)", groupe: "Général (ancien)" },
  { value: "pension_versee", label: "Pension versée (générique)", groupe: "Général (ancien)" },
  { value: "charges_recurrentes", label: "Charges récurrentes (générique)", groupe: "Général (ancien)" },
  { value: "autres", label: "Autres (générique)", groupe: "Général (ancien)" },
] as const;

export const IMMOBILIER_TYPES = [
  { value: "residence_principale", label: "Résidence principale" },
  { value: "residence_secondaire", label: "Résidence secondaire" },
  { value: "locatif", label: "Locatif" },
  { value: "sci", label: "SCI" },
  { value: "nue_propriete", label: "Nue-propriété" },
  { value: "usufruit", label: "Usufruit" },
  { value: "autre", label: "Autre" },
] as const;

export const FINANCIER_TYPES = [
  { value: "livret_a", label: "Livret A" },
  { value: "ldds", label: "LDDS" },
  { value: "cel", label: "CEL" },
  { value: "pel", label: "PEL" },
  { value: "compte_sur_livret", label: "Compte sur livret" },
  { value: "assurance_vie", label: "Assurance-vie" },
  { value: "per", label: "PER" },
  { value: "percol", label: "PERCOL / PERCO" },
  { value: "pea", label: "PEA" },
  { value: "compte_titres", label: "Compte-titres" },
  { value: "comptes_bancaires", label: "Comptes bancaires" },
  { value: "scpi", label: "SCPI" },
  { value: "autres", label: "Autres" },
] as const;

export const OBJECTIF_TYPES = [
  { value: "retraite", label: "Retraite" },
  { value: "transmission", label: "Transmission" },
  { value: "fiscalite", label: "Fiscalité" },
  { value: "revenus_complementaires", label: "Revenus complémentaires" },
  { value: "acquisition_immobiliere", label: "Acquisition immobilière" },
  { value: "protection_familiale", label: "Protection familiale" },
  { value: "constitution_capital", label: "Constitution de capital" },
  { value: "autre", label: "Autre" },
] as const;

export const PERIODICITES = [
  { value: "mensuel", label: "Mensuel" },
  { value: "annuel", label: "Annuel" },
] as const;

export const PRIORITES = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "basse", label: "Basse" },
] as const;

export type RevenuType = (typeof REVENU_TYPES)[number]["value"];
export type ChargeType = (typeof CHARGE_TYPES)[number]["value"];
export type ImmobilierType = (typeof IMMOBILIER_TYPES)[number]["value"];
export type FinancierType = (typeof FINANCIER_TYPES)[number]["value"];
export type ObjectifType = (typeof OBJECTIF_TYPES)[number]["value"];
export type Periodicite = (typeof PERIODICITES)[number]["value"];
export type Priorite = (typeof PRIORITES)[number]["value"];

export interface Revenu {
  id: string;
  clientId: string;
  type: RevenuType;
  montant: number;
  periodicite: Periodicite;
  titulaire?: string;
}

export interface Charge {
  id: string;
  clientId: string;
  type: ChargeType;
  montant: number;
  periodicite: Periodicite;
}

export interface BienImmobilier {
  id: string;
  clientId: string;
  type: ImmobilierType;
  valeurEstimee: number;
  creditRestant: number;
  mensualiteCredit: number;
}

export interface ActifFinancier {
  id: string;
  clientId: string;
  type: FinancierType;
  montant: number;
  etablissement?: string;
}

export interface Objectif {
  id: string;
  clientId: string;
  type: ObjectifType;
  montantCible?: number;
  echeance?: string;
  priorite: Priorite;
}
