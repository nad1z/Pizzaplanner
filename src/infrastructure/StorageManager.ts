import { FIELD_BOUNDS, isValidStyleId } from '../domain/validation';
import type { PizzaStyleId } from '../domain/models/PizzaStyle';
import { YEAST_TYPES } from '../domain/models/YeastType';
import type { YeastTypeId } from '../domain/models/YeastType';

export interface PersistedState {
  styleId: PizzaStyleId;
  numPizzas: number;
  ballWeightG: number;
  pizzaDiameterCm: number;
  hydrationPct: number;
  yeastId: YeastTypeId;
}

function isValidPersistedState(raw: unknown): raw is PersistedState {
  if (!raw || typeof raw !== 'object') return false;
  const d = raw as Record<string, unknown>;
  return (
    isValidStyleId(d.styleId) &&
    typeof d.numPizzas       === 'number' && d.numPizzas       >= FIELD_BOUNDS.numPizzas.min       && d.numPizzas       <= FIELD_BOUNDS.numPizzas.max &&
    typeof d.ballWeightG     === 'number' && d.ballWeightG     >= FIELD_BOUNDS.ballWeightG.min     && d.ballWeightG     <= FIELD_BOUNDS.ballWeightG.max &&
    typeof d.pizzaDiameterCm === 'number' && d.pizzaDiameterCm >= FIELD_BOUNDS.pizzaDiameterCm.min && d.pizzaDiameterCm <= FIELD_BOUNDS.pizzaDiameterCm.max &&
    typeof d.hydrationPct    === 'number' && d.hydrationPct    >= FIELD_BOUNDS.hydrationPct.min    && d.hydrationPct    <= FIELD_BOUNDS.hydrationPct.max &&
    typeof d.yeastId === 'string' && d.yeastId in YEAST_TYPES
  );
}

export class StorageManager {
  private static readonly KEY = 'pizza-calc-v1';

  static load(): PersistedState | null {
    try {
      const raw = JSON.parse(localStorage.getItem(this.KEY) ?? 'null');
      return isValidPersistedState(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  static save(data: PersistedState): void {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable (private browsing, storage full, etc.)
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.KEY);
    } catch {
      // localStorage unavailable
    }
  }
}
