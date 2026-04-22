import { describe, it, expect } from 'vitest';
import { PizzaStyle } from '../../domain/models/PizzaStyle';
import type { PizzaStyleId } from '../../domain/models/PizzaStyle';

const ALL_IDS: PizzaStyleId[] = ['neapolitan', 'newyork', 'roman', 'brooklyn', 'detroit', 'sicilian'];

describe('PizzaStyle', () => {
  it('defines all six styles', () => {
    expect(Object.keys(PizzaStyle.STYLES)).toHaveLength(6);
    for (const id of ALL_IDS) {
      expect(PizzaStyle.STYLES[id]).toBeDefined();
    }
  });

  it('every style has a non-empty name, emoji, and description', () => {
    for (const id of ALL_IDS) {
      const s = PizzaStyle.STYLES[id];
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.emoji.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(0);
    }
  });

  it('every style has hydration min < recommended < max', () => {
    for (const id of ALL_IDS) {
      const { hydration } = PizzaStyle.STYLES[id];
      expect(hydration.min).toBeLessThan(hydration.recommended);
      expect(hydration.recommended).toBeLessThan(hydration.max);
    }
  });

  it('every style has ballWeight min < max', () => {
    for (const id of ALL_IDS) {
      const { ballWeight } = PizzaStyle.STYLES[id];
      expect(ballWeight.min).toBeLessThan(ballWeight.max);
    }
  });

  it('every style has non-negative salt and oil percentages', () => {
    for (const id of ALL_IDS) {
      const s = PizzaStyle.STYLES[id];
      expect(s.saltPercent).toBeGreaterThanOrEqual(0);
      expect(s.oilPercent).toBeGreaterThanOrEqual(0);
    }
  });

  it('neapolitan has zero oil', () => {
    expect(PizzaStyle.STYLES.neapolitan.oilPercent).toBe(0);
  });

  it('roman has the highest hydration range', () => {
    const romanMax = PizzaStyle.STYLES.roman.hydration.max;
    for (const id of ALL_IDS) {
      if (id !== 'roman') {
        expect(PizzaStyle.STYLES[id].hydration.max).toBeLessThanOrEqual(romanMax);
      }
    }
  });
});
