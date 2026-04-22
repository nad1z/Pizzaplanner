import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../../infrastructure/StorageManager';
import type { PersistedState } from '../../infrastructure/StorageManager';

const SAMPLE: PersistedState = {
  styleId: 'neapolitan',
  numPizzas: 4,
  ballWeightG: 240,
  pizzaDiameterCm: 22,
  hydrationPct: 62,
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

  it('returns null on corrupted storage data', () => {
    localStorage.setItem('pizza-calc-v1', 'not-valid-json{{{');
    expect(StorageManager.load()).toBeNull();
  });
});
