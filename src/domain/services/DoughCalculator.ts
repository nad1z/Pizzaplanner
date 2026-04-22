export interface DoughInputs {
  numPizzas: number;
  ballWeightG: number;
  hydrationPct: number;
  saltPct: number;
  oilPct: number;
}

export interface RecipeResult {
  totalDough: number;
  flourG: number;
  waterG: number;
  saltG: number;
  oilG: number;
}

export class DoughCalculator {
  static ballWeightFromDiameter(cm: number): number {
    return Math.round(0.65 * Math.PI * Math.pow(cm / 2, 2));
  }

  static diameterFromBallWeight(g: number): number {
    if (!Number.isFinite(g) || g <= 0) return 0;
    return Math.round(2 * Math.sqrt(g / (0.65 * Math.PI)));
  }

  static compute({ numPizzas, ballWeightG, hydrationPct, saltPct, oilPct }: DoughInputs): RecipeResult {
    const h = hydrationPct / 100;
    const s = saltPct / 100;
    const o = oilPct / 100;
    const totalDough = numPizzas * ballWeightG;
    const flourG = Math.round(totalDough / (1 + h + s + o));
    const waterG = Math.round(flourG * h);
    const saltG = Math.round(flourG * s * 10) / 10;
    const oilG = Math.round(flourG * o * 10) / 10;
    return { totalDough, flourG, waterG, saltG, oilG };
  }
}
