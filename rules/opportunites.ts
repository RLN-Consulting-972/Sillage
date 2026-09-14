/**
 * Moteur de règles — RULES_V0.1
 *
 * Chaque règle est une fonction pure et déterministe : à partir des
 * données déjà saisies (revenus, charges, patrimoine), elle renvoie une
 * opportunité ou rien. Aucun appel à Claude ici — ces règles sont
 * volontairement simples et explicites, pas encore un moteur configurable
 * avec versions/priorités en base de données (ce sera l'étape suivante
 * une fois ces 6 règles validées à l'usage, comme prévu dès le départ :
 * "ne crée pas 120 règles, crée 10 règles de démonstration").
 *
 * Un conseiller reste toujours décisionnaire : ces opportunités sont des
 * pistes à étudier, jamais des recommandations automatiques.
 */

import {
  calculateRevenusMensuels,
  calculateSavingsCapacity,
  calculateRealEstateRatio,
  calculateDebtRatio,
  calculateLiquidityMonths,
  type RevenuLike,
  type ChargeLike,
  type BienImmobilierLike,
  type ActifFinancierLike,
} from "@/calculations/patrimoine";

export type PrioriteOpportunite = "haute" | "moyenne" | "basse";

export interface Opportunite {
  id: string;
  titre: string;
  raison: string;
  priorite: PrioriteOpportunite;
  categorie: string;
}

const LIQUIDE_TYPES = ["livret_a", "ldds", "cel", "compte_sur_livret", "comptes_bancaires"];
const EPARGNE_LONG_TERME_TYPES = ["per", "percol", "assurance_vie"];
const CREDIT_CHARGE_TYPES = ["credit_immobilier", "credit_consommation", "leasing", "prets_divers"];

export interface DonneesClientPourRegles {
  revenus: RevenuLike[];
  charges: (ChargeLike & { type: string })[];
  biens: (BienImmobilierLike & { mensualiteCredit: number })[];
  actifs: (ActifFinancierLike & { type: string })[];
}

export function detecterOpportunites(data: DonneesClientPourRegles): Opportunite[] {
  const opportunites: Opportunite[] = [];
  const { revenus, charges, biens, actifs } = data;

  // 1. Concentration immobilière
  const ratioImmobilier = calculateRealEstateRatio(biens, actifs);
  if (ratioImmobilier > 0.7) {
    opportunites.push({
      id: "concentration-immobiliere",
      titre: "Concentration immobilière",
      raison: `L'immobilier représente ${Math.round(ratioImmobilier * 100)}% du patrimoine brut — une diversification pourrait être étudiée.`,
      priorite: "moyenne",
      categorie: "patrimoine",
    });
  }

  // 2. Faible liquidité
  const actifsLiquides = actifs.filter((a) => LIQUIDE_TYPES.includes(a.type));
  const moisDeLiquidite = calculateLiquidityMonths(actifsLiquides, charges);
  if (moisDeLiquidite < 3) {
    opportunites.push({
      id: "faible-liquidite",
      titre: "Faible liquidité",
      raison: `L'épargne disponible rapidement ne couvre que ${moisDeLiquidite.toFixed(1)} mois de charges (recommandation usuelle : 3 mois minimum).`,
      priorite: "haute",
      categorie: "patrimoine",
    });
  }

  // 3. Endettement élevé
  const tauxEndettement = calculateDebtRatio(biens, revenus);
  if (tauxEndettement > 0.33) {
    opportunites.push({
      id: "endettement-eleve",
      titre: "Endettement élevé",
      raison: `Les mensualités de crédit immobilier représentent ${Math.round(tauxEndettement * 100)}% des revenus mensuels (seuil usuel : 33%).`,
      priorite: "haute",
      categorie: "financement",
    });
  }

  // 4. Assurance emprunteur à vérifier
  const aUnCreditImmobilierEnCours = biens.some((b) => b.creditRestant > 0);
  if (aUnCreditImmobilierEnCours) {
    opportunites.push({
      id: "assurance-emprunteur-a-verifier",
      titre: "Assurance emprunteur à vérifier",
      raison: "Un crédit immobilier est en cours — le contrat d'assurance emprunteur associé n'a pas encore été analysé dans le dossier.",
      priorite: "moyenne",
      categorie: "assurance_emprunteur",
    });
  }

  // 5. Regroupement de crédits à étudier
  const nombreCreditsActifs = charges.filter((c) => CREDIT_CHARGE_TYPES.includes(c.type)).length;
  if (nombreCreditsActifs >= 2) {
    opportunites.push({
      id: "regroupement-credits",
      titre: "Regroupement de crédits à étudier",
      raison: `${nombreCreditsActifs} crédits distincts identifiés dans les charges — un regroupement pourrait alléger les mensualités.`,
      priorite: "moyenne",
      categorie: "financement",
    });
  }

  // 6. Capacité d'épargne importante non valorisée
  const capaciteEpargne = calculateSavingsCapacity(revenus, charges);
  const revenusMensuels = calculateRevenusMensuels(revenus);
  const aDejaEpargneLongTerme = actifs.some((a) => EPARGNE_LONG_TERME_TYPES.includes(a.type));
  if (revenusMensuels > 0 && capaciteEpargne / revenusMensuels > 0.2 && !aDejaEpargneLongTerme) {
    opportunites.push({
      id: "capacite-epargne-a-valoriser",
      titre: "Capacité d'épargne à valoriser",
      raison: "Une capacité d'épargne mensuelle notable a été identifiée, sans PER, PERCOL ni assurance-vie déjà en place.",
      priorite: "moyenne",
      categorie: "per",
    });
  }

  return opportunites;
}
