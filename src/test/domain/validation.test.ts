import { describe, it, expect } from 'vitest';
import { absoluteError, isValidStyleId, FIELD_BOUNDS } from '../../domain/validation';

describe('isValidStyleId', () => {
  it('accepts all six known style IDs', () => {
    const ids = ['neapolitan', 'newyork', 'roman', 'brooklyn', 'detroit', 'sicilian'];
    for (const id of ids) {
      expect(isValidStyleId(id)).toBe(true);
    }
  });

  it('rejects unknown strings', () => {
    expect(isValidStyleId('chicago')).toBe(false);
    expect(isValidStyleId('')).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isValidStyleId(42)).toBe(false);
    expect(isValidStyleId(null)).toBe(false);
    expect(isValidStyleId(undefined)).toBe(false);
    expect(isValidStyleId({})).toBe(false);
  });
});

describe('absoluteError', () => {
  const bounds = FIELD_BOUNDS.hydrationPct; // { min: 40, max: 100 }

  it('returns undefined when value is within bounds', () => {
    expect(absoluteError(62, bounds, '%')).toBeUndefined();
    expect(absoluteError(40, bounds, '%')).toBeUndefined();
    expect(absoluteError(100, bounds, '%')).toBeUndefined();
  });

  it('returns a min message when value is below min', () => {
    const err = absoluteError(30, bounds, '%');
    expect(err).toMatch(/minimum/i);
    expect(err).toContain('40');
    expect(err).toContain('%');
  });

  it('returns a max message when value is above max', () => {
    const err = absoluteError(150, bounds, '%');
    expect(err).toMatch(/maximum/i);
    expect(err).toContain('100');
    expect(err).toContain('%');
  });

  it('returns a validation message for non-finite values', () => {
    expect(absoluteError(Infinity, bounds, '%')).toBeTruthy();
    expect(absoluteError(NaN, bounds, '%')).toBeTruthy();
  });

  it('includes the unit in error messages', () => {
    expect(absoluteError(0, FIELD_BOUNDS.ballWeightG, 'g')).toContain('g');
    expect(absoluteError(9999, FIELD_BOUNDS.ballWeightG, 'g')).toContain('g');
  });
});

describe('FIELD_BOUNDS', () => {
  it('every field has min < max', () => {
    for (const [, bounds] of Object.entries(FIELD_BOUNDS)) {
      expect(bounds.min).toBeLessThan(bounds.max);
    }
  });

  it('all min values are positive', () => {
    for (const [, bounds] of Object.entries(FIELD_BOUNDS)) {
      expect(bounds.min).toBeGreaterThan(0);
    }
  });
});
