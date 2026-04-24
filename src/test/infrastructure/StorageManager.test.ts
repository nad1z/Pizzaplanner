import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../../infrastructure/StorageManager';
import type { PersistedState } from '../../infrastructure/StorageManager';

const SAMPLE: PersistedState = {
  styleId: 'neapolitan',
  numPizzas: 4,
  ballWeightG: 240,
  pizzaDiameterCm: 22,
  hydrationPct: 62,
  yeastId: 'idy',
};

describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing is stored', () => {
    expect(StorageManager.load()).toBeNull();
  });

  it('saves and loads a state round-trip', () => {
    StorageManager.save(SAMPLE);
    const loaded = StorageManager.load();
    expect(loaded).toEqual(SAMPLE);
  });

  it('clears stored state', () => {
    StorageManager.save(SAMPLE);
    StorageManager.clear();
    expect(StorageManager.load()).toBeNull();
  });

  it('overwrites previous state on save', () => {
    StorageManager.save(SAMPLE);
    const updated: PersistedState = { ...SAMPLE, numPizzas: 6 };
    StorageManager.save(updated);
    expect(StorageManager.load()?.numPizzas).toBe(6);
  });

  it('returns null on corrupted JSON', () => {
    localStorage.setItem('pizza-calc-v1', 'not-valid-json{{{');
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null for an unknown styleId', () => {
    localStorage.setItem('pizza-calc-v1', JSON.stringify({ ...SAMPLE, styleId: 'chicago' }));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null for an unknown yeastId', () => {
    localStorage.setItem('pizza-calc-v1', JSON.stringify({ ...SAMPLE, yeastId: 'wild' }));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null when numPizzas exceeds max bound', () => {
    localStorage.setItem('pizza-calc-v1', JSON.stringify({ ...SAMPLE, numPizzas: 999 }));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null when numPizzas is below min bound', () => {
    localStorage.setItem('pizza-calc-v1', JSON.stringify({ ...SAMPLE, numPizzas: 0 }));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null when ballWeightG exceeds max bound', () => {
    localStorage.setItem('pizza-calc-v1', JSON.stringify({ ...SAMPLE, ballWeightG: 5000 }));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null when hydrationPct exceeds max bound', () => {
    localStorage.setItem('pizza-calc-v1', JSON.stringify({ ...SAMPLE, hydrationPct: 200 }));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null when a field is not a number', () => {
    localStorage.setItem('pizza-calc-v1', JSON.stringify({ ...SAMPLE, numPizzas: '4' }));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null when a required field is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hydrationPct: _, ...partial } = SAMPLE;
    localStorage.setItem('pizza-calc-v1', JSON.stringify(partial));
    expect(StorageManager.load()).toBeNull();
  });

  it('returns null when yeastId is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { yeastId: _, ...partial } = SAMPLE;
    localStorage.setItem('pizza-calc-v1', JSON.stringify(partial));
    expect(StorageManager.load()).toBeNull();
  });

  it('accepts all three valid yeast types', () => {
    for (const yeastId of ['idy', 'ady', 'sourdough'] as const) {
      StorageManager.save({ ...SAMPLE, yeastId });
      expect(StorageManager.load()?.yeastId).toBe(yeastId);
    }
  });
});
