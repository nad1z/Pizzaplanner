export interface DoughInputs {
  numPizzas: number;
  ballWeightG: number;
  hydrationPct: number;
  saltPct: number;
  oilPct: number;
  yeastPct: number;
}

export interface RecipeResult {
  totalDough: number;
  flourG: number;
  waterG: number;
  saltG: number;
  oilG: number;
  yeastG: number;
}

export class DoughCalculator {
  // K=0.31 g/cm² matches real-world medium-crust pizzas
  // (Rule of 22 calibration: 14"≈308g, 12"≈226g, 10"≈157g)
  private static readonly K = 0.31;

  static ballWeightFromDiameter(cm: number): number {
    return Math.round(this.K * Math.PI * Math.pow(cm / 2, 2));
  }

  static diameterFromBallWeight(g: number): number {
    if (!Number.isFinite(g) || g <= 0) return 0;
    return Math.round(2 * Math.sqrt(g / (this.K * Math.PI)));
  }

  static compute({ numPizzas, ballWeightG, hydrationPct, saltPct, oilPct, yeastPct }: DoughInputs): RecipeResult {
    const h = hydrationPct / 100;
    const s = saltPct / 100;
    const o = oilPct / 100;
    const y = yeastPct / 100;
    const totalDough = numPizzas * ballWeightG;
    const flourG = Math.round(totalDough / (1 + h + s + o));
    const waterG = Math.round(flourG * h);
    const saltG = Math.round(flourG * s * 10) / 10;
    const oilG = Math.round(flourG * o * 10) / 10;
    const yeastG = Math.round(flourG * y * 10) / 10;
    return { totalDough, flourG, waterG, saltG, oilG, yeastG };
  }
}
