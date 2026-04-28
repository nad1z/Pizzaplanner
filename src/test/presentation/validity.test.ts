import { describe, it, expect } from 'vitest';
import { validityLevel, DOT_CLASSES, RING_COLORS } from '../../presentation/utils/validity';
import type { ValidityLevel } from '../../presentation/utils/validity';

describe('validityLevel', () => {
  it('returns green when value is within range', () => {
    expect(validityLevel(62, 58, 65)).toBe('green');
    expect(validityLevel(58, 58, 65)).toBe('green');
    expect(validityLevel(65, 58, 65)).toBe('green');
  });

  it('returns yellow when value is slightly outside range (≤10% over range span)', () => {
    // span=20, 10% = 2 → yellow zone: 58–60 and 80–82
    expect(validityLevel(59, 60, 80)).toBe('yellow');
    expect(validityLevel(81, 60, 80)).toBe('yellow');
  });

  it('returns red when value is critically outside range (>10% over range span)', () => {
    expect(validityLevel(50, 58, 65)).toBe('red');
    expect(validityLevel(80, 58, 65)).toBe('red');
  });

  it('handles exact boundary transitions correctly', () => {
    const min = 60, max = 70;
    const span = max - min;
    const tenPct = span * 0.1;
    expect(validityLevel(max + tenPct, min, max)).toBe('yellow');
    expect(validityLevel(max + tenPct + 0.01, min, max)).toBe('red');
  });
});

describe('DOT_CLASSES', () => {
  const levels: ValidityLevel[] = ['green', 'yellow', 'red'];

  it('has a class for every validity level', () => {
    for (const level of levels) {
      expect(DOT_CLASSES[level]).toBeTruthy();
    }
  });

  it('all classes are distinct', () => {
    const classes = levels.map(l => DOT_CLASSES[l]);
    expect(new Set(classes).size).toBe(3);
  });
});

describe('RING_COLORS', () => {
  const levels: ValidityLevel[] = ['green', 'yellow', 'red'];

  it('has a hex color for every validity level', () => {
    for (const level of levels) {
      expect(RING_COLORS[level]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('all colors are distinct', () => {
    const colors = levels.map(l => RING_COLORS[l]);
    expect(new Set(colors).size).toBe(3);
  });
});
