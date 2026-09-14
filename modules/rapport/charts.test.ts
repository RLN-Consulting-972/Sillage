import { describe, it, expect } from "vitest";
import { buildDonutPaths, buildHorizontalBars } from "./charts";

describe("buildDonutPaths", () => {
  it("renvoie un tracé par tranche non nulle", () => {
    const result = buildDonutPaths(
      [
        { value: 70, color: "#C4A160", label: "Immobilier" },
        { value: 30, color: "#8C2859", label: "Financier" },
      ],
      50, 50, 40, 20
    );
    expect(result).toHaveLength(2);
    expect(result[0].pourcentage).toBeCloseTo(70);
    expect(result[1].pourcentage).toBeCloseTo(30);
    expect(result[0].path).toContain("M");
    expect(result[0].path).toContain("A");
  });

  it("renvoie un tableau vide si le total est nul (évite une division par zéro)", () => {
    expect(buildDonutPaths([{ value: 0, color: "#000", label: "x" }], 50, 50, 40, 20)).toEqual([]);
  });

  it("les pourcentages des tranches totalisent 100", () => {
    const result = buildDonutPaths(
      [
        { value: 25, color: "#111", label: "a" },
        { value: 25, color: "#222", label: "b" },
        { value: 50, color: "#333", label: "c" },
      ],
      50, 50, 40, 20
    );
    const total = result.reduce((s, r) => s + r.pourcentage, 0);
    expect(total).toBeCloseTo(100);
  });
});

describe("buildHorizontalBars", () => {
  it("la plus grande valeur occupe toute la largeur disponible", () => {
    const bars = buildHorizontalBars(
      [
        { label: "Revenus", value: 4000, color: "#C4A160" },
        { label: "Charges", value: 2000, color: "#6E1E33" },
      ],
      200
    );
    expect(bars[0].width).toBe(200);
    expect(bars[1].width).toBe(100);
  });

  it("ne plante pas si toutes les valeurs sont à 0", () => {
    const bars = buildHorizontalBars([{ label: "x", value: 0, color: "#000" }], 200);
    expect(bars[0].width).toBe(0);
  });
});
