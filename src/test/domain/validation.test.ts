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
  const bounds = FIELD_BOUNDS.hydrationPct; // { min: 40, max: 115 }

  it('returns undefined when value is within bounds', () => {
    expect(absoluteError(62,  bounds, '%')).toBeUndefined();
    expect(absoluteError(40,  bounds, '%')).toBeUndefined();
    expect(absoluteError(115, bounds, '%')).toBeUndefined();
  });

  it('returns below_min code with correct values when below min', () => {
    const err = absoluteError(30, bounds, '%');
    expect(err).toEqual({ kind: 'below_min', min: 40, unit: '%' });
  });

  it('returns above_max code with correct values when above max', () => {
    const err = absoluteError(150, bounds, '%');
    expect(err).toEqual({ kind: 'above_max', max: 115, unit: '%' });
  });

  it('returns invalid code for non-finite values', () => {
    expect(absoluteError(Infinity, bounds, '%')).toEqual({ kind: 'invalid' });
    expect(absoluteError(NaN, bounds, '%')).toEqual({ kind: 'invalid' });
  });

  it('includes the unit in error codes', () => {
    const below = absoluteError(0, FIELD_BOUNDS.ballWeightG, 'g');
    const above = absoluteError(9999, FIELD_BOUNDS.ballWeightG, 'g');
    expect(below).toMatchObject({ unit: 'g' });
    expect(above).toMatchObject({ unit: 'g' });
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
