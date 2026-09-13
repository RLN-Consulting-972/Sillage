/**
 * Moteur de calcul — fonctions pures et déterministes uniquement.
 * Aucun appel à Claude ici, conformément au principe posé dès le
 * cahier des charges initial : les calculs et l'IA sont deux couches
 * séparées. Claude pourra plus tard interpréter ces résultats, mais ne
 * doit jamais les recalculer lui-même.
 */

export interface RevenuLike {
  montant: number;
  periodicite: "mensuel" | "annuel";
}
export interface ChargeLike {
  montant: number;
  periodicite: "mensuel" | "annuel";
}
export interface BienImmobilierLike {
  valeurEstimee: number;
  creditRestant: number;
}
export interface ActifFinancierLike {
  montant: number;
}

function toMensuel(montant: number, periodicite: "mensuel" | "annuel"): number {
  return periodicite === "annuel" ? montant / 12 : montant;
}

export function calculateRevenusMensuels(revenus: RevenuLike[]): number {
  return revenus.reduce((total, r) => total + toMensuel(r.montant, r.periodicite), 0);
}

export function calculateChargesMensuelles(charges: ChargeLike[]): number {
  return charges.reduce((total, c) => total + toMensuel(c.montant, c.periodicite), 0);
}

export function calculateSavingsCapacity(
  revenus: RevenuLike[],
  charges: ChargeLike[]
): number {
  return calculateRevenusMensuels(revenus) - calculateChargesMensuelles(charges);
}

export function calculatePatrimoineImmobilierBrut(biens: BienImmobilierLike[]): number {
  return biens.reduce((total, b) => total + b.valeurEstimee, 0);
}

export function calculateCreditRestantImmobilier(biens: BienImmobilierLike[]): number {
  return biens.reduce((total, b) => total + b.creditRestant, 0);
}

export function calculatePatrimoineFinancier(actifs: ActifFinancierLike[]): number {
  return actifs.reduce((total, a) => total + a.montant, 0);
}

export function calculateGrossWealth(
  biens: BienImmobilierLike[],
  actifs: ActifFinancierLike[]
): number {
  return calculatePatrimoineImmobilierBrut(biens) + calculatePatrimoineFinancier(actifs);
}

export function calculateNetWealth(
  biens: BienImmobilierLike[],
  actifs: ActifFinancierLike[]
): number {
  return calculateGrossWealth(biens, actifs) - calculateCreditRestantImmobilier(biens);
}

export function calculateRealEstateRatio(
  biens: BienImmobilierLike[],
  actifs: ActifFinancierLike[]
): number {
  const brut = calculateGrossWealth(biens, actifs);
  if (brut === 0) return 0;
  return calculatePatrimoineImmobilierBrut(biens) / brut;
}
