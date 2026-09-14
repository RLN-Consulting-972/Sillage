/**
 * @react-pdf/renderer ne sait pas afficher du Recharts (fait pour le
 * DOM du navigateur) — ces fonctions tracent des graphiques simples en
 * SVG natif, compatible PDF, à partir de données déjà calculées
 * ailleurs (aucun calcul de valeur ici, seulement de la géométrie).
 */

export interface DonutSlice {
  value: number;
  color: string;
  label: string;
}

interface DonutPathResult {
  path: string;
  color: string;
  label: string;
  pourcentage: number;
}

/** Calcule les arcs d'un donut à partir de parts (valeurs brutes, pas des %). */
export function buildDonutPaths(
  slices: DonutSlice[],
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number
): DonutPathResult[] {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return [];

  let angleStart = -Math.PI / 2; // démarre en haut
  const results: DonutPathResult[] = [];

  for (const slice of slices) {
    const fraction = slice.value / total;
    const angleEnd = angleStart + fraction * 2 * Math.PI;

    const largeArc = angleEnd - angleStart > Math.PI ? 1 : 0;

    const x1o = cx + rOuter * Math.cos(angleStart);
    const y1o = cy + rOuter * Math.sin(angleStart);
    const x2o = cx + rOuter * Math.cos(angleEnd);
    const y2o = cy + rOuter * Math.sin(angleEnd);
    const x1i = cx + rInner * Math.cos(angleEnd);
    const y1i = cy + rInner * Math.sin(angleEnd);
    const x2i = cx + rInner * Math.cos(angleStart);
    const y2i = cy + rInner * Math.sin(angleStart);

    const path = [
      `M ${x1o} ${y1o}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x2i} ${y2i}`,
      "Z",
    ].join(" ");

    results.push({ path, color: slice.color, label: slice.label, pourcentage: fraction * 100 });
    angleStart = angleEnd;
  }

  return results;
}

export interface BarDatum {
  label: string;
  value: number;
  color: string;
}

/** Calcule les rectangles d'un graphique en barres horizontales simple. */
export function buildHorizontalBars(
  data: BarDatum[],
  maxWidth: number
): { label: string; value: number; width: number; color: string }[] {
  const max = Math.max(...data.map((d) => d.value), 1);
  return data.map((d) => ({
    ...d,
    width: (d.value / max) * maxWidth,
  }));
}
