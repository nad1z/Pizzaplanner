import { describe, it, expect } from 'vitest';
import { DoughCalculator } from '../../domain/services/DoughCalculator';

describe('DoughCalculator', () => {
  describe('ballWeightFromDiameter', () => {
    it('converts 30cm diameter to correct ball weight', () => {
      expect(DoughCalculator.ballWeightFromDiameter(30)).toBe(459);
    });

    it('converts 28cm diameter to correct ball weight', () => {
      expect(DoughCalculator.ballWeightFromDiameter(28)).toBe(400);
    });

    it('is the inverse of diameterFromBallWeight within rounding', () => {
      const original = 250;
      const diameter = DoughCalculator.diameterFromBallWeight(original);
      const roundTripped = DoughCalculator.ballWeightFromDiameter(diameter);
      expect(Math.abs(roundTripped - original)).toBeLessThanOrEqual(5);
    });
  });

  describe('diameterFromBallWeight', () => {
    it('converts 250g ball to correct diameter', () => {
      expect(DoughCalculator.diameterFromBallWeight(250)).toBe(22);
    });

    it('converts 500g ball to correct diameter', () => {
      expect(DoughCalculator.diameterFromBallWeight(500)).toBe(31);
    });
  });

  describe('compute', () => {
    it('calculates correct flour for a standard neapolitan recipe', () => {
      // 960 / (1 + 0.62 + 0.028 + 0) = 960 / 1.648 ≈ 582.5 → 583
      const result = DoughCalculator.compute({
        numPizzas: 4,
        ballWeightG: 240,
        hydrationPct: 62,
        saltPct: 2.8,
        oilPct: 0,
      });
      expect(result.totalDough).toBe(960);
      expect(result.flourG).toBe(583);
      expect(result.waterG).toBe(361);
    });

    it('totalDough equals numPizzas × ballWeightG', () => {
      const result = DoughCalculator.compute({
        numPizzas: 3,
        ballWeightG: 300,
        hydrationPct: 65,
        saltPct: 2,
        oilPct: 2,
      });
      expect(result.totalDough).toBe(900);
    });

    it('waterG approximates flourG × hydration within rounding', () => {
      const result = DoughCalculator.compute({
        numPizzas: 1,
        ballWeightG: 250,
        hydrationPct: 70,
        saltPct: 2,
        oilPct: 0,
      });
      expect(Math.abs(result.waterG - result.flourG * 0.70)).toBeLessThanOrEqual(1);
    });

    it('saltG is zero when saltPct is zero', () => {
      const result = DoughCalculator.compute({
        numPizzas: 1,
        ballWeightG: 250,
        hydrationPct: 62,
        saltPct: 0,
        oilPct: 0,
      });
      expect(result.saltG).toBe(0);
    });

    it('oilG is zero when oilPct is zero', () => {
      const result = DoughCalculator.compute({
        numPizzas: 1,
        ballWeightG: 250,
        hydrationPct: 62,
        saltPct: 2.8,
        oilPct: 0,
      });
      expect(result.oilG).toBe(0);
    });

    it('flourG + waterG + saltG + oilG approximates totalDough', () => {
      const result = DoughCalculator.compute({
        numPizzas: 2,
        ballWeightG: 270,
        hydrationPct: 65,
        saltPct: 2,
        oilPct: 2,
      });
      const sum = result.flourG + result.waterG + result.saltG + result.oilG;
      expect(Math.abs(sum - result.totalDough)).toBeLessThanOrEqual(2);
    });
  });
});
