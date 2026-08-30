export const REVENU_TYPES = [
  { value: "salaire", label: "Salaire" },
  { value: "revenus_professionnels", label: "Revenus professionnels" },
  { value: "revenus_fonciers", label: "Revenus fonciers" },
  { value: "pensions", label: "Pensions" },
  { value: "retraites", label: "Retraites" },
  { value: "dividendes", label: "Dividendes" },
  { value: "interets", label: "Intérêts" },
  { value: "autres", label: "Autres" },
] as const;

export const CHARGE_TYPES = [
  { value: "credit_immobilier", label: "Crédit immobilier" },
  { value: "credit_consommation", label: "Crédit consommation" },
  { value: "leasing", label: "Leasing" },
  { value: "loyer", label: "Loyer" },
  { value: "pension_versee", label: "Pension versée" },
  { value: "charges_recurrentes", label: "Charges récurrentes" },
  { value: "autres", label: "Autres" },
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
  { value: "assurance_vie", label: "Assurance-vie" },
  { value: "per", label: "PER" },
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
